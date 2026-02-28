// Import the core alova instance
import alovaInstance from './core/instance'

// Export the global Apis object from the generated code
import { createApis, withConfigType } from './createApis'

// Export the alova instance for direct use if needed
export { alovaInstance }

// Configure method options for specific APIs
export const $$userConfigMap = withConfigType({})

// Create the global Apis object
const Apis = createApis(alovaInstance, $$userConfigMap)

// Export and mount common functions
import { uploadByUni } from './common'
(globalThis as any).uploadByUni = uploadByUni

// Export both default and named export for AutoImport
export default Apis
export { Apis, uploadByUni }
