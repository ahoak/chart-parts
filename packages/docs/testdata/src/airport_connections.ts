/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

// Bar Chart Example, captured from https://vega.github.io/vega/examples/bar-chart/
declare const require: any
import { parseScene } from '@chart-parts/scenegraph'
const data = require('../resources/airport_connections.json')

export const scenegraph = parseScene(data)
export const title = 'Airport Connections'
export const dimensions = {
	height: 700,
	width: 550,
	origin: [70, 19] as [number, number],
}
