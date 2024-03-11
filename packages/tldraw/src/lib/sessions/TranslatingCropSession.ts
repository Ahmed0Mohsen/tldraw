import { Session, TLImageShape } from '@tldraw/editor'
import { getTranslateCroppedImageChange } from '../tools/SelectTool/childStates/Cropping/children/crop_helpers'

export class TranslatingCropSession extends Session {
	readonly id = 'translating_crop'

	initialShape = {} as TLImageShape

	didTranslate = false

	onStart() {
		const { editor } = this

		this.editor.setCursor({ type: 'move', rotation: 0 })
		this.initialShape = editor.getOnlySelectedShape() as TLImageShape
		return
	}

	onUpdate() {
		const { editor, initialShape } = this

		// If the user has stopped dragging, we're done
		if (!editor.inputs.isDragging) {
			this.complete()
			return
		}

		if (!this.didTranslate) {
			// mark when we start dragging
			editor.mark('translating crop')
			this.didTranslate = true
		}

		const { originPagePoint, currentPagePoint } = editor.inputs
		const delta = currentPagePoint.clone().sub(originPagePoint)
		const partial = getTranslateCroppedImageChange(editor, initialShape, delta)

		if (partial) {
			this.editor.updateShapes([partial], { squashing: true })
		}

		return
	}

	onInterrupt() {
		return
	}

	onComplete() {
		return
	}

	onCancel() {
		this.editor.bailToMark('translating crop')
		return
	}

	onEnd() {
		this.editor.setCursor({ type: 'default', rotation: 0 })
	}
}
