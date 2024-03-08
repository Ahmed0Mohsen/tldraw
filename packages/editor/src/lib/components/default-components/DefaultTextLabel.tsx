import {
	TLDefaultColorStyle,
	TLDefaultFillStyle,
	TLDefaultFontStyle,
	TLDefaultHorizontalAlignStyle,
	TLDefaultVerticalAlignStyle,
	TLShapeId,
} from '@tldraw/tlschema'
import React from 'react'
import { MeasureMethod } from '../../editor/managers/TextManager'
import { Box } from '../../primitives/Box'

/** @alpha */
export type TLTextTriggerHook = (
	inputEl: HTMLTextAreaElement | null,
	onComplete: (text: string) => void
) => {
	onKeyDown: (
		e: React.KeyboardEvent<HTMLTextAreaElement>,
		coords: {
			top: number
			left: number
		}
	) => Promise<boolean>
}

type TextLabelProps = {
	id: TLShapeId
	type: string
	font: TLDefaultFontStyle
	fontSize: number
	lineHeight: number
	fill?: TLDefaultFillStyle
	align: TLDefaultHorizontalAlignStyle
	verticalAlign: TLDefaultVerticalAlignStyle
	wrap?: boolean
	text: string
	labelColor: TLDefaultColorStyle
	bounds?: Box
	classNamePrefix?: string
	style?: React.CSSProperties
	textWidth?: number
	textHeight?: number
	useTextTriggerCharacter?: TLTextTriggerHook
}

type ITextLabel<P> = React.NamedExoticComponent<P> & {
	measureMethod?: MeasureMethod
}

/** @alpha */
export type TLTextLabel = ITextLabel<TextLabelProps>

/** @alpha */
export const DefaultTextLabel: TLTextLabel = React.memo(function DefaultTextLabel({ text }) {
	return (
		<div className={`tl-text-label tl-text-wrapper`}>
			<div className="tl-text tl-text-content" dir="ltr">
				{text}
			</div>
		</div>
	)
})
DefaultTextLabel.measureMethod = 'text'
