/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	Scales,
	DataFrame,
	ChannelNames,
	SceneNode,
	ScaleCreationContext,
	ChannelHandler,
	Channels,
	ViewSize,
	Mark,
} from '@chart-parts/interfaces'

/**
 * The scene frame is analagous to a stack-frame - it contains contextual
 * information for a section of a scene, including dimensions, scales, data, and event handlers
 */
export class SceneFrame {
	public constructor(
		public node: SceneNode,
		public mark: Mark | undefined,
		public data: DataFrame,
		public view: ViewSize,
		public viewTL: [number, number] = [0, 0],
		public viewBR: [number, number] = [view.height, view.width],
		public scales: Scales = {},
		public channels: ChannelNames = {},
		public channelId: number = 0,
		public channelHandlers: Channels = {},
		public boundDataItem: any = {},
		public parentId: string = '',
	) {}

	/**
	 * Pushes a new scene frame with a given scene node; recomputes scales.
	 */
	public pushNode(node: SceneNode) {
		const scales = this.getRecomputedScales(node, this.viewTL, this.viewBR)
		return new SceneFrame(
			node,
			undefined,
			this.data,
			this.view,
			this.viewTL,
			this.viewBR,
			scales,
			{},
			this.channelId,
			this.channelHandlers,
			this.boundDataItem,
			this.parentId,
		)
	}

	/**
	 * Pushes a new mark context.
	 */
	public pushMark(mark: Mark) {
		const channels = this.registerChannels(mark.channels)
		return new SceneFrame(
			this.node,
			mark,
			this.data,
			this.view,
			this.viewTL,
			this.viewBR,
			this.scales,
			channels,
			this.channelId,
			this.channelHandlers,
			this.boundDataItem,
			`${this.parentId}.${mark.name || mark.type}`,
		)
	}

	/**
	 * Push data into a new frame
	 * @param data The new data tables eto register
	 * @param facetKey If present, registers the current facet key for id generation
	 */
	public pushData(data: DataFrame, facetKey?: string) {
		const dataFrame = { ...this.data, ...data }
		const id = facetKey ? `${this.parentId}.facet(${facetKey})` : this.parentId
		return new SceneFrame(
			this.node,
			this.mark,
			dataFrame,
			this.view,
			this.viewTL,
			this.viewBR,
			this.scales,
			this.channels,
			this.channelId,
			this.channelHandlers,
			this.boundDataItem,
			id,
		)
	}

	/**
	 * Pushes a new sceneframe with an updated viewspace. Recomputes scales.
	 *
	 * @param view The new view to push. This is the size of the group that will be inserted
	 * @param viewTL The top-left of the draw-area within the view. This does not affect the emitted
	 * group, but does affect draw-scales
	 * @param viewBR The bottom-right of the draw-area within the view. This does not affect the emitted
	 * group, but does affect draw-scales
	 */
	public pushView(
		view: ViewSize,
		viewTL: [number, number] = [0, 0],
		viewBR: [number, number] = [view.height, view.width],
	) {
		// if the view has not changed, then don't return a new frame - recomputing the
		// scales can be expensive
		if (
			areViewSizesEqual(view, this.view) &&
			areCoordsEqual(viewTL, this.viewTL)
		) {
			return this
		}

		const scales = this.getRecomputedScales(this.node, viewTL, viewBR)
		return new SceneFrame(
			this.node,
			this.mark,
			this.data,
			view,
			viewTL,
			viewBR,
			scales,
			this.channels,
			this.channelId,
			this.channelHandlers,
			this.boundDataItem,
			this.parentId,
		)
	}

	/**
	 * Pushes a new data item to bind to
	 * @param dataItem The data item to bind to
	 */
	public pushBoundDataItem(dataItem: any) {
		return new SceneFrame(
			this.node,
			this.mark,
			this.data,
			this.view,
			this.viewTL,
			this.viewBR,
			this.scales,
			this.channels,
			this.channelId,
			this.channelHandlers,
			dataItem,
			this.parentId,
		)
	}

	private getRecomputedScales(
		node: SceneNode,
		viewTL: [number, number],
		viewBR: [number, number],
	) {
		const data = this.data
		let scales = { ...this.scales }

		const xBounds: [number, number] = [viewTL[1], viewBR[1]]
		const yBounds: [number, number] = [viewBR[0], viewTL[0]]

		node.scales.forEach(creator => {
			const args: ScaleCreationContext = {
				view: this.view,
				viewBounds: { x: xBounds, y: yBounds },
				data,
				scales,
			}
			const newScales = creator(args)
			scales = { ...scales, ...newScales }
		})
		return scales
	}

	private registerChannels(channels: Channels): ChannelNames {
		// For each channel the client specifies, encode the name-mapping in the Scenegraph and
		// map the handler function in our scene result
		return Object.entries(channels).reduce(
			(prev, [eventName, handler]) => {
				prev[eventName] = this.registerHandler(handler)
				return prev
			},
			({} as any) as ChannelNames,
		)
	}

	private registerHandler(handler: ChannelHandler<any>) {
		const id = `evt${this.channelId++}`
		this.channelHandlers[id] = handler
		return id
	}
}

function areViewSizesEqual(a: ViewSize, b: ViewSize) {
	return a.height === b.height && a.width === b.width
}

function areCoordsEqual(a: [number, number], b: [number, number]) {
	return a[0] === b[0] && a[1] === b[1]
}
