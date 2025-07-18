/*
Copyright 2023-2025 API Testing Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
export interface TestCaseResponse {
  output: string
  body: {},
  statusCode: number
}

export interface Store {
  name: string
  readOnly: boolean
}

export interface Stores {
  current: string
  items: Store[]
}

export interface Preference {
  darkTheme: boolean
  requestActiveTab: string,
  responseActiveTab: string
}

export function GetTestCaseResponseCache(id: string) {
  const val = sessionStorage.getItem(id)
  if (val && val !== '') {
    return JSON.parse(val)
  } else {
    return {} as TestCaseResponse
  }
}

export function SetTestCaseResponseCache(id: string, resp: TestCaseResponse) {
  sessionStorage.setItem(id, JSON.stringify(resp))
}

const lastTestCaseLocationKey = "api-testing-case-location"
export function GetLastTestCaseLocation() {
  const val = localStorage.getItem(lastTestCaseLocationKey)
  if (val && val !== '') {
    return JSON.parse(val)
  } else {
    return {}
  }
}

export function SetLastTestCaseLocation(suite: string, testcase: string) {
  localStorage.setItem(lastTestCaseLocationKey, JSON.stringify({
    suite: suite,
    testcase: testcase
  }))
  return
}

const preferenceKey = "api-testing-preference"
export function GetPreference() {
  const val = localStorage.getItem(preferenceKey)
  if (val && val !== '') {
    return JSON.parse(val)
  } else {
    const navLanguage = navigator.language != null ? navigator.language : 'zh-CN';
    return {
      darkTheme: false,
      language: navLanguage,
      requestActiveTab: "body",
      responseActiveTab: "body"
    } as Preference
  }
}

export function SetPreference(preference: Preference) {
  localStorage.setItem(preferenceKey, JSON.stringify(preference))
  return
}

export function WithRequestActiveTab(tab: string) {
  const preference = GetPreference()
  preference.requestActiveTab = tab
  SetPreference(preference)
}

function WithResponseActiveTab(tab: string) {
  const preference = GetPreference()
  preference.responseActiveTab = tab
  SetPreference(preference)
}

function WithDarkTheme(darkTheme: boolean) {
  const preference = GetPreference()
  preference.darkTheme = darkTheme
  SetPreference(preference)
}

function WithLocale(locale: string) {
  const preference = GetPreference()
  preference.language = locale
  SetPreference(preference)
}

const storeKey = "stores"
function GetCurrentStore() {
  const val = sessionStorage.getItem(storeKey)
  if (val && val !== '') {
    const stores = JSON.parse(val)
    for (let i = 0; i < stores.items.length; i++) {
      if (stores.items[i].name === stores.current) {
        return stores.items[i]
      }
    }
  }
  return {}
}

function SetCurrentStore(name: string) {
  const val = sessionStorage.getItem(storeKey)
  if (val && val !== '') {
    const stores = JSON.parse(val)
    stores.current = name
    SetStores(stores)
  }
}

function SetStores(stores: Stores | Store[]) {
  if ('current' in stores) {
    sessionStorage.setItem(storeKey, JSON.stringify(stores))
  } else {
    sessionStorage.setItem(storeKey, JSON.stringify({
      items: stores
    }))
  }
  return
}

interface DataManagerPreference {
  currentStore: string
  currentDatabase: string
  query: string
}

const DataManagerPreferenceKey = "data-manager-preference"
export function GetDataManagerPreference(): DataManagerPreference {
  const val = sessionStorage.getItem(DataManagerPreferenceKey)
  if (val && val !== '') {
    return JSON.parse(val)
  } else {
    return {
      currentStore: ''
    } as DataManagerPreference
  }
}

export function SetDataManagerPreference(field: string, value: string) {
  const preference = GetDataManagerPreference()
  switch (field) {
    case 'currentStore':
      preference.currentStore = value
      break;
    case 'currentDatabase':
      preference.currentDatabase = value
      break;
    case 'query':
      preference.query = value
      break;
    default:
      return
  }
  sessionStorage.setItem(DataManagerPreferenceKey, JSON.stringify(preference))
  return
}

export const Cache = {
  GetTestCaseResponseCache,
  SetTestCaseResponseCache,
  GetLastTestCaseLocation,
  SetLastTestCaseLocation,
  GetPreference,
  WithRequestActiveTab,
  WithResponseActiveTab,
  WithDarkTheme,
  WithLocale,
  GetCurrentStore, SetStores, SetCurrentStore
}
