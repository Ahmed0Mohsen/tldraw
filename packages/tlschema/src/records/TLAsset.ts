import { createRecordType, RecordId } from '@tldraw/store'
import { T } from '@tldraw/validate'
import { TLBaseAsset } from '../assets/TLBaseAsset'
import { bookmarkAssetValidator, TLBookmarkAsset } from '../assets/TLBookmarkAsset'
import { imageAssetValidator, TLImageAsset } from '../assets/TLImageAsset'
import { TLVideoAsset, videoAssetValidator } from '../assets/TLVideoAsset'
import { TLShape } from './TLShape'

// 💡❗ If you make any changes to this type, make sure you also add a migration if required.
// 💡❗ (see the tlschema README.md for instructions)

/** @public */
export type TLAsset = TLImageAsset | TLVideoAsset | TLBookmarkAsset

/** @internal */
export const assetValidator: T.Validator<TLAsset> = T.model(
	'asset',
	T.union('type', {
		image: imageAssetValidator,
		video: videoAssetValidator,
		bookmark: bookmarkAssetValidator,
		// 💡❗ If you make any changes to this type, make sure you also add a migration if required.
		// 💡❗ (see the tlschema README.md for instructions)
	})
)

/** @public */
export type TLAssetPartial<T extends TLAsset = TLAsset> = T extends T
	? {
			id: TLAssetId
			type: T['type']
			props?: Partial<T['props']>
			meta?: Partial<T['meta']>
		} & Partial<Omit<T, 'type' | 'id' | 'props' | 'meta'>>
	: never

/** @public */
export const AssetRecordType = createRecordType<TLAsset>('asset', {
	validator: assetValidator,
	scope: 'document',
}).withDefaultProperties(() => ({
	meta: {},
}))

/** @public */
export type TLAssetId = RecordId<TLBaseAsset<any, any>>

/** @public */
export type TLAssetShape = Extract<TLShape, { props: { assetId: TLAssetId } }>
