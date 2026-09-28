import { type SVGProps } from 'react'
import * as Icons from './icons'

type IconName = keyof typeof Icons;

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
}
