import { Session, TLImageShape, Vec } from '@tldraw/editor'
import { getTranslateCroppedImageChange } from '../tools/SelectTool/childStates/Crop/children/crop_helpers'

export class NudgingCropSession extends Session<{
	shape: TLImageShape
	onExit: () => void
}> {
	readonly id = 'cropping'

	didNudge = false
	startTime = Date.now()

	// Don't update on tick, just on key repeat
	// override handleTick = () => void null

	onStart() {
		this.editor.mark('nudging crop')
		return
	}

	onUpdate() {
		const {
			editor: {
				inputs: { keys },
			},
		} = this

		// On first update, nudge; then wait 250ms before nudging again,
		// and after that nudge continuously on every frame until completed
		if (this.didNudge && Date.now() - this.startTime < 250) {
			return
		}

		// If the shape has gone, we're done
		const shape = this.editor.getShape(this.editor.getCroppingShapeId()!) as TLImageShape
		if (!shape) {
			this.complete()
			return
		}

		const delta = new Vec(0, 0)

		// Adjust the delta based on which keys are down
		if (keys.has('ArrowLeft')) delta.x += 1
		if (keys.has('ArrowRight')) delta.x -= 1
		if (keys.has('ArrowUp')) delta.y += 1
		if (keys.has('ArrowDown')) delta.y -= 1

		// Shift-nudge only on the first update.
		// We want to use the "actual" shift key state,
		// not the one that's in the editor.inputs.shiftKey,
		// because that one uses a short timeout on release
		if (!this.didNudge && keys.has('ShiftLeft')) {
			delta.mul(10)
		}

		if (delta.equals(new Vec(0, 0))) {
			this.complete()
			return
		}

		const partial = getTranslateCroppedImageChange(this.editor, shape, delta)
		if (!partial) return

		if (!this.didNudge) {
			this.editor.mark('translate crop')
			this.didNudge = true
		}

		this.editor.updateShape<TLImageShape>(partial)
	}

	onInterrupt() {
		return
	}

	onComplete() {
		this.info.onExit()
		return
	}

	onCancel() {
		this.editor.bailToMark('nudging crop')
		this.info.onExit()
		return
	}
}
