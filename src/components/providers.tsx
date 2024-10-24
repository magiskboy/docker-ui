'use client'

import React from 'react';
import { Provider as JotaiProvider } from 'jotai';

import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from '../routeTree.gen'

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { HttpBackendOptions} from 'i18next-http-backend';

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}


i18n.use(initReactI18next).init<HttpBackendOptions>({
  fallbackLng: 'en', 
  loadPath: '/locales/{{lng}}/{{ns}}.json',
})


export const Providers: React.FC = () => {
  return (
    <>
      <JotaiProvider>
        <RouterProvider router={router} />
      </JotaiProvider>
    </>
  )
}
