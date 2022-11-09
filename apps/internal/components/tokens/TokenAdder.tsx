import { Token as TokenEntity } from '@sushiswap/currency'
import { Menu, Typography } from '@sushiswap/ui'
import stringify from 'fast-json-stable-stringify'
import { Token, TokenLogo } from 'lib'
import React, { FC, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'

interface TokenAdder {
  token: Token
  hasIcon: boolean
}

export const TokenAdder: FC<TokenAdder> = ({ token, hasIcon }) => {
  const [selectedLogoURI, setSelectedLogoURI] = useState<string>()
  const [addState, setAddState] = useState<'ready' | 'submitting' | 'error'>('ready')

  const { data: tokenLogos } = useSWR<TokenLogo[]>('tokenLogos', () =>
    fetch('/internal/api/tokens/tokenLogos').then((data) => data.json())
  )

  const _token = useMemo(
    () =>
      new TokenEntity({
        address: token.id.split(':')[1],
        decimals: token.decimals,
        chainId: token.chainId,
        symbol: token.symbol,
      }),
    [token.chainId, token.decimals, token.id, token.symbol]
  )

  const submitToken = useCallback(
    async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
      setAddState('submitting')
      try {
        const logo = await fetch(selectedLogoURI)
          .then((response) => response.blob())
          .then((blob) => {
            return new Promise((resolve) => {
              const reader = new FileReader()
              reader.onload = function () {
                resolve(this.result)
              } // <--- `this.result` contains a base64 data URI
              reader.readAsDataURL(blob)
            })
          })

        const result = await fetch(process.env.NEXT_PUBLIC_PARTNER_URL + '/partner/api/submitToken', {
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: stringify({
            tokenAddress: token.id.split(':')[1],
            tokenData: {
              name: token.name,
              symbol: token.symbol,
              decimals: token.decimals,
            },
            tokenIcon: logo,
            chainId: token.chainId,
            listType: 'default-token-list',
          }),
        })

        const { listPr } = await result.json()
        if (listPr) {
          setAddState('ready')
          window.open(listPr, '_blank')
        } else {
          throw new Error('An unexpected error has occured.')
        }
      } catch (e) {
        console.error(e)
        setAddState('error')
      }
    },
    [selectedLogoURI, token]
  )

  return (
    <Menu
      button={
        <Menu.Button variant="empty" className="px-0">
          TEST
          {/* {selectedLogoURI ? (
            <>
              <Image src={selectedLogoURI} height={24} width={24} alt="img" className="rounded-full" />
              <div
                onClick={(e) => submitToken(e)}
                className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-700"
              >
                {addState === 'ready' && <CheckIcon className="text-white" width={24} height={24} />}
                {addState === 'submitting' && <Loader width={24} height={24} />}
                {addState === 'error' && <XIcon className="text-red" width={24} height={24} />}
              </div>
            </>
          ) : hasIcon ? (
            <Currency.Icon disableLink currency={_token} width={24} height={24} />
          ) : (
            <svg width={24} height={24} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="30" rx="15" fill="url(#paint0_linear_13084_19043)" />
              <defs>
                <linearGradient
                  id="paint0_linear_13084_19043"
                  x1="-2.30769"
                  y1="4.25715e-07"
                  x2="35.0955"
                  y2="9.13387"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0993EC" />
                  <stop offset="1" stopColor="#F338C3" />
                </linearGradient>
              </defs>
            </svg>
          )} */}
        </Menu.Button>
      }
    >
      <Menu.Items className="scroll max-h-[200px]">
        {tokenLogos?.map((logo) => (
          <Menu.Item
            key={logo.name}
            value={logo.name}
            onClick={() => setSelectedLogoURI(logo.url)}
            className="flex items-center"
          >
            <Typography variant="sm">{logo.name}</Typography>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
}
