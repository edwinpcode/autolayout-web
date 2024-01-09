import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { listReducer } from "./List/listSlice"
import { menuReducer } from "./Menu/menuSlice"
import { userReducer } from "./User/userSlice"
import { nodeReducer } from "./Flowchart/nodeSlice"
import { edgeReducer } from "./Flowchart/edgeSlice"
import { elementReducer } from "./Flowchart/elementSlice"
import { hiddenElementReducer } from "./HiddenElement/hiddenElementSlice"
import { dropdownReducer } from "./Input/DropdownSlice"
import { loadingReducer } from "./Loading/LoadingSlice"
import { formReducer } from "./Form/FormSlice"
import { menuSideabarReducer } from "./Menu/menuSidebarSlice"
import storage from "redux-persist/lib/storage"
import thunk from "redux-thunk"
import { persistReducer, persistStore } from "redux-persist"
import { tokenReducer } from "./Token/tokenSlice"
import storageSession from "redux-persist/lib/storage/session"
import devReducer from "./Dev/DevModeSlice"
import { inboxReducer } from "./Inbox/InboxStore"
import LogoReducer from "./LogoSlice"

const persistConfig = {
  key: "root",
  storage: storageSession,
}

const reducer = combineReducers({
  // register your reducer here
  menu: menuReducer,
  hiddenElement: hiddenElementReducer,
  user: userReducer,
  list: listReducer,
  node: nodeReducer,
  edge: edgeReducer,
  element: elementReducer,
  dropdown: dropdownReducer,
  loading: loadingReducer,
  form: formReducer,
  menuSidebar: menuSideabarReducer,
  token: tokenReducer,
  devMode: devReducer,
  inbox: inboxReducer,
  logo: LogoReducer,
})

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: reducer,
  // reducer: persistedReducer,
  // middleware: [thunk],
})
// export const persistor = persistStore(store)
