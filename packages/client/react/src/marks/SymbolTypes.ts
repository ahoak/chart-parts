/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MarkType, SymbolType } from '@chart-parts/interfaces'
import { CommonMarkProps, MarkEncodingProp } from '../interfaces'
import { BaseMark } from './BaseMark'

export interface SymbolOfTypeProps extends CommonMarkProps {
	size?: MarkEncodingProp<number>
}

abstract class SymbolOfType extends BaseMark<SymbolOfTypeProps> {
	public markType = MarkType.Symbol

	protected abstract getShape(): SymbolType

	protected encodeCustomProperties() {
		const { size } = this.props
		const shape = this.getShape()
		return { size, shape }
	}
}

export class Circle extends SymbolOfType {
	protected getShape() {
		return SymbolType.Circle
	}
}

export class Cross extends SymbolOfType {
	protected getShape() {
		return SymbolType.Cross
	}
}

export class Diamond extends SymbolOfType {
	protected getShape() {
		return SymbolType.Diamond
	}
}

export class Square extends SymbolOfType {
	protected getShape() {
		return SymbolType.Square
	}
}

export class TriangleDown extends SymbolOfType {
	protected getShape() {
		return SymbolType.TriangleDown
	}
}

export class TriangleUp extends SymbolOfType {
	protected getShape() {
		return SymbolType.TriangleUp
	}
}

export class TriangleLeft extends SymbolOfType {
	protected getShape() {
		return SymbolType.TriangleLeft
	}
}

export class TriangleRight extends SymbolOfType {
	protected getShape() {
		return SymbolType.Circle
	}
}
