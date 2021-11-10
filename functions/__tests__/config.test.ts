import { readFileSync } from 'fs'
import { resolve as pathResolve } from 'path'
import * as yaml from 'js-yaml'
import mockedEnv from 'mocked-env'
import defaultEnvironment from './data/environment'

const EXTENSION_YAML = yaml.load(
  readFileSync(pathResolve(__dirname, '../../extension.yaml'), 'utf8')
)

const extensionParams = EXTENSION_YAML.params.reduce((obj, parameter) => {
  obj[parameter.param] = parameter
  return obj
}, {})

describe('extensions config', () => {
  let config
  let restoreEnv

  beforeEach(() => {
    jest.resetModules()
    restoreEnv = mockedEnv(defaultEnvironment)
    config = require('../src/config').default
  })
  afterEach(() => restoreEnv())

  test('config loaded from environment variables', () => {
    const testConfig = {
      location: defaultEnvironment.LOCATION,
      collectionPath: defaultEnvironment.COLLECTION_PATH,
      fieldsToIndex: defaultEnvironment.FIELDS_TO_INDEX,
      searchableFields: defaultEnvironment.SEARCHABLE_FIELDS,
      meilisearchIndex: defaultEnvironment.MEILISEARCH_INDEX_NAME,
      meilisearchHost: defaultEnvironment.MEILISEARCH_HOST,
      meilisearchApiKey: defaultEnvironment.MEILISEARCH_API_KEY,
    }

    expect(config).toStrictEqual(testConfig)
  })

  // FIELDS_TO_INDEX
  describe('Test fieldsToIndex parameter', () => {
    test('param exists', () => {
      const extensionParam = extensionParams['FIELDS_TO_INDEX']
      expect(extensionParam).toMatchSnapshot()
    })

    describe('validationRegex', () => {
      test('does not allow spaces', () => {
        const { validationRegex } = extensionParams['FIELDS_TO_INDEX']
        const text = 'foo bar'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).toBeNull()
      })

      test('allow comma-separated list', () => {
        const { validationRegex } = extensionParams['FIELDS_TO_INDEX']
        const text = 'field1,field2,field3'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).not.toBeNull()
      })

      test('allows a alphanumeric underscore list of field', () => {
        const { validationRegex } = extensionParams['FIELDS_TO_INDEX']
        const text = 'field_1,field_2,field_3'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).not.toBeNull()
      })

      test('allows a alphanumeric dash list of field', () => {
        const { validationRegex } = extensionParams['FIELDS_TO_INDEX']
        const text = 'field-1,field-2,field-3'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).not.toBeNull()
      })
    })
  })

  // MEILISEARCH_INDEX_NAME
  describe('Test meilisearchIndex parameters', () => {
    test('param exists', () => {
      const extensionParam = extensionParams['MEILISEARCH_INDEX_NAME']
      expect(extensionParam).toMatchSnapshot()
    })

    describe('validationRegex', () => {
      test('does not allow empty strings', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = ''
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).toBeNull()
      })

      test('does not allow spaces', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = 'foo bar'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).toBeNull()
      })

      test('allows a alphanumeric underscore in index name', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = 'index_1'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).not.toBeNull()
      })

      test('allows a alphanumeric dash in index name', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = 'index-1'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).not.toBeNull()
      })
    })
  })

  // SEARCHABLE_FIELDS
  describe('Test searchableFields parameters', () => {
    test('param exists', () => {
      const extensionParam = extensionParams['SEARCHABLE_FIELDS']
      expect(extensionParam).toMatchSnapshot()
    })

    describe('validationRegex', () => {
      test('does not allow spaces', () => {
        const { validationRegex } = extensionParams['SEARCHABLE_FIELDS']
        const text = 'foo bar'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).toBeNull()
      })

      test('allow comma-separated list', () => {
        const { validationRegex } = extensionParams['SEARCHABLE_FIELDS']
        const text = 'field1,field2,field3'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).not.toBeNull()
      })

      test('allows a alphanumeric underscore list of field', () => {
        const { validationRegex } = extensionParams['SEARCHABLE_FIELDS']
        const text = 'field_1,field_2,field_3'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).not.toBeNull()
      })

      test('allows a alphanumeric dash list of field', () => {
        const { validationRegex } = extensionParams['SEARCHABLE_FIELDS']
        const text = 'field-1,field-2,field-3'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).not.toBeNull()
      })
    })
  })
})