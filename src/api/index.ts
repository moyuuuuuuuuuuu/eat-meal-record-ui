// Import the core alova instance
import alovaInstance from './core/instance'

// Export the global Apis object from the generated code
import { createApis, withConfigType } from './createApis'

// Export the alova instance for direct use if needed
export { alovaInstance }

// Configure method options for specific APIs
export const $$userConfigMap = withConfigType({
  'diary.getMeals': {
    transform: (data: any) => {
      const transformedData: Record<string, any[]> = {}
      for (const key in data) {
        transformedData[key] = data[key].map((item: any) => ({
          ...item,
          calories: Number.parseFloat(item.calories) || 0,
          protein: Number.parseFloat(item.protein) || 0,
          carbs: Number.parseFloat(item.carbs) || 0,
          fat: Number.parseFloat(item.fat) || 0,
        }))
      }
      return transformedData
    },
  },
})

// Create the global Apis object
const Apis = createApis(alovaInstance, $$userConfigMap)

// Export both default and named export for AutoImport
export default Apis
export { Apis }
