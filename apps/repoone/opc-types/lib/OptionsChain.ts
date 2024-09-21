import { OptionData } from './OptionData';
import { Map } from 'immutable';

type YYYYMMdd = string;
type Strike = number;
type StrikeOld = string;

type OpTypes = 'c' | 'p';

export type OptionsChain_optionsImm = Map<Strike, OptionData>;
export type OptionsChain_options = Record<Strike, OptionData>;
export type OptionsChainOld_options = Record<StrikeOld, OptionData>;

export type OptionsChain_typesImm = Map<OpTypes, OptionsChain_optionsImm>;
export type OptionsChain_types = Record<OpTypes, OptionsChain_options>;
export type OptionsChainOld_types = Record<OpTypes, OptionsChainOld_options>;

export type OptionsChainImm = Map<YYYYMMdd, null | OptionsChain_typesImm>;
export type OptionsChain = Record<YYYYMMdd, null | OptionsChain_types>;
export type OptionsChainOld = Record<YYYYMMdd, null | OptionsChainOld_types>;
