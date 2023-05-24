import { ChainId } from '@sushiswap/chain'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Form, Select } from '@sushiswap/ui'
import { _useBalance as useBalance, useAccount } from '@sushiswap/wagmi'
import { FC, useCallback, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { useFundSourceFromZFundSource, useTokenFromZToken, ZFundSourceToFundSource } from '../../../lib/zod'
import { CurrencyInputBase } from '../../CurrencyInput'
import { FormErrors } from './CreateForm'
import { FundSourceOption } from './FundSourceOption'
import { CreateStreamFormSchemaType } from './schema'
import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'

export const StreamAmountDetails: FC<{ chainId: ChainId }> = ({ chainId }) => {
  const { address } = useAccount()

  const {
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateStreamFormSchemaType & FormErrors>()

  const [amount, currency, fundSource] = watch(['amount', 'currency', 'fundSource'])
  const _currency = useTokenFromZToken(currency)
  const _fundSource = useFundSourceFromZFundSource(fundSource)
  const { data: balance } = useBalance({
    account: address,
    currency: _currency,
    chainId,
    loadBentobox: true,
  })

  const onSelect = useCallback(
    (onChange: (...event: any[]) => void, currency: Type) => {
      if (currency.isNative) {
        const { chainId, decimals, symbol, name, isNative } = currency
        onChange({
          chainId,
          decimals,
          address: undefined,
          symbol,
          name,
          isNative,
        })
        setValue('fundSource', FundSource.WALLET)
      } else {
        const { chainId, decimals, symbol, name, isNative, wrapped } = currency
        onChange({
          chainId,
          decimals,
          address: wrapped.address,
          symbol,
          name,
          isNative,
        })
      }
    },
    [setValue]
  )

  useEffect(() => {
    const cAmount = tryParseAmount(amount, _currency)
    if (!_fundSource || !balance?.[_fundSource] || !cAmount) return
    if (balance[_fundSource].lessThan(cAmount)) {
      setError('FORM_ERROR', { type: 'min', message: 'Insufficient Balance' })
    } else {
      clearErrors('FORM_ERROR')
    }
  }, [_currency, _fundSource, amount, balance, clearErrors, setError])

  return (
    <Form.Section
      title="Stream Details"
      description="Furo allows you to create a stream from BentoBox to allow the recipient to gain yield whilst receiving the stream if the token that's being used has a BentoBox strategy set on it."
    >
      <Form.Control label="Token*">
        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TokenSelector
                id={'create-single-stream'}
                chainId={chainId}
                onSelect={(currency) => onSelect(onChange, currency)}
                selected={_currency}
              >
                {({ setOpen }) => (
                  <Select.Button
                    error={!!error?.message}
                    standalone
                    className="!cursor-pointer ring-offset-slate-900"
                    onClick={() => setOpen(true)}
                  >
                    {value?.symbol || <span className="text-slate-500">Select a currency</span>}
                  </Select.Button>
                )}
              </TokenSelector>
              <Form.Error message={error?.message} />
            </>
          )}
        />
      </Form.Control>
      <Form.Control label="Change Funds Source*">
        <Controller
          control={control}
          name="fundSource"
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const _value = ZFundSourceToFundSource.parse(value)
            return (
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <FundSourceOption
                    chainId={chainId}
                    label="Wallet"
                    active={_value === FundSource.WALLET}
                    value={FundSource.WALLET}
                    currency={_currency}
                    onChange={() => onChange(FundSource.WALLET)}
                  />
                  {!currency?.isNative && (
                    <FundSourceOption
                      chainId={chainId}
                      label="BentoBox"
                      active={_value === FundSource.BENTOBOX}
                      value={FundSource.BENTOBOX}
                      currency={_currency}
                      onChange={() => onChange(FundSource.BENTOBOX)}
                    />
                  )}
                </div>
                <Form.Error message={error?.message} />
              </div>
            )
          }}
        />
      </Form.Control>
      <Form.Control label="Stream Amount*">
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => {
            return (
              <>
                <CurrencyInputBase
                  onBlur={onBlur}
                  name={name}
                  className="ring-offset-slate-900"
                  onChange={onChange}
                  value={value || ''}
                  currency={_currency}
                />
                <Form.Error message={error?.message || errors['FORM_ERROR']?.message} />
              </>
            )
          }}
        />
      </Form.Control>
    </Form.Section>
  )
}
