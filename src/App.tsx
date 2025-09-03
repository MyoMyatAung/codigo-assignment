import { RouterProvider } from '@tanstack/react-router'
import { AuthProvider, useAuth } from './auth'
import { router } from './router'
import { ThemeProvider } from './components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

function InnerApp() {
    const auth = useAuth()
    return <RouterProvider router={router} context={{ auth }} />
}

const queryClient = new QueryClient()

function App() {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <InnerApp />
                        </PersistGate>
                    </Provider>
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App