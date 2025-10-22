import React, { useState, useEffect, useMemo } from 'react';
import { useWallet } from './hooks/useWallet';
import { useApi } from './hooks/useApi';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { StatusNotification } from './components/ui/StatusNotification';
import { BalanceSection } from './components/forms/BalanceSection';
import { RegisterForm } from './components/forms/RegisterForm';
import { LoadForm } from './components/forms/LoadForm';
import { PaymentForm } from './components/forms/PaymentForm';
import type { ViewType, ClientData } from './types';
import { VIEWS } from './utils/constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(VIEWS.REGISTER);

  const {
    walletData,
    status,
    isLoading,
    isBalanceLoading,
    updateWalletData,
    setStatus,
    setIsLoading,
    handleCheckBalance
  } = useWallet();

  const { registerClient, loadWallet, initPayment, confirmPayment } = useApi();

  useEffect(() => {
    if (view === VIEWS.BALANCE && !isBalanceLoading) {
      handleCheckBalance();
    }
  }, [view, isBalanceLoading, handleCheckBalance]);

  const handleRegister = async (clientData: ClientData) => {
    setIsLoading(true);
    setStatus({ message: 'Registrando cliente...', type: 'info' });

    const response = await registerClient(clientData);

    if (response.success) {
      setStatus({ message: '¡Registro exitoso! Ya puedes operar tu billetera.', type: 'success' });
      updateWalletData({
        document: clientData.document,
        phone: clientData.phone,
        balance: 0.00
      });
      setView(VIEWS.BALANCE);
    } else {
      setStatus({ message: response.message || 'Error en el registro', type: 'error' });
    }
    setIsLoading(false);
  };

  const handleLoad = async (amount: number) => {
    setIsLoading(true);
    setStatus({ message: `Recargando ${amount.toFixed(2)} USD...`, type: 'info' });

    const response = await loadWallet({
      document: walletData.document,
      phone: walletData.phone,
      amount
    });

    if (response.success) {
      setStatus({ message: `Recarga exitosa de ${amount.toFixed(2)} USD.`, type: 'success' });
      handleCheckBalance();
    } else {
      setStatus({ message: response.message || 'Error en la recarga', type: 'error' });
    }
    setIsLoading(false);
  };

  const handlePayment = async (amount: number) => {
    setIsLoading(true);
    setStatus({ message: 'Iniciando proceso de pago (Fase 1/2)...', type: 'info' });

    try {
      const initResponse = await initPayment({
        document: walletData.document,
        phone: walletData.phone,
        amount
      });

      if (!initResponse.success || !initResponse.data) {
        throw new Error(initResponse.message || 'Error al iniciar el pago.');
      }

      const { sessionId, token } = initResponse.data;

      if (!sessionId || !token) {
        throw new Error('El servicio no devolvió SessionId o Token para la confirmación.');
      }

      setStatus({ message: 'Pago iniciado. Confirmando transacción (Fase 2/2)...', type: 'info' });

      const confirmResponse = await confirmPayment({ sessionId, token });

      if (!confirmResponse.success) {
        throw new Error(confirmResponse.message || 'Error al confirmar el pago.');
      }

      setStatus({ message: `¡Pago exitoso de ${amount.toFixed(2)} USD!`, type: 'success' });
      handleCheckBalance();
    } catch (error) {
      setStatus({
        message: `Transacción fallida: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentContent = useMemo(() => {
    switch (view) {
      case VIEWS.REGISTER:
        return (
          <RegisterForm
            onRegister={handleRegister}
            isLoading={isLoading}
          />
        );
      case VIEWS.LOAD:
        return (
          <LoadForm
            walletData={walletData}
            onLoad={handleLoad}
            onUpdateWalletData={updateWalletData}
            isLoading={isLoading}
          />
        );
      case VIEWS.PAY:
        return (
          <PaymentForm
            walletData={walletData}
            onPayment={handlePayment}
            onUpdateWalletData={updateWalletData}
            isLoading={isLoading}
          />
        );
      case VIEWS.BALANCE:
      default:
        return (
          <BalanceSection
            walletData={walletData}
            isBalanceLoading={isBalanceLoading}
            onUpdateWalletData={updateWalletData}
            onCheckBalance={handleCheckBalance}
          />
        );
    }
  }, [view, walletData, isLoading, isBalanceLoading, handleCheckBalance, updateWalletData]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center font-['Inter']">
      <div className="w-full max-w-lg bg-gray-50 rounded-xl shadow-2xl overflow-hidden">
        <Header />

        <div className="p-6 bg-white">
          <div className="mb-4 p-3 bg-indigo-50 border-l-4 border-indigo-300 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-1">Cuenta Activa (Por defecto):</p>
            <p>
              Doc: <span className="font-mono bg-indigo-100 px-1 rounded">{walletData.document}</span> |
              Tel: <span className="font-mono bg-indigo-100 px-1 rounded">{walletData.phone}</span>
            </p>
          </div>

          <StatusNotification
            notification={status}
            onClose={() => setStatus({ message: '', type: 'info' })}
          />

          <Navigation
            currentView={view}
            onViewChange={setView}
          />

          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-md">
            {currentContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
