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
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  // Inicializa la vista por defecto a Registrar
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

  // Al cambiar a la vista de Saldo, se fuerza una consulta de balance
  useEffect(() => {
    if (view === VIEWS.BALANCE) {
      handleCheckBalance();
    }
  }, [view, handleCheckBalance]);

  const handleRegister = async (clientData: ClientData) => {
    // Validación para prevenir registro si ya hay una cuenta activa
    if (walletData.document && walletData.phone) {
      setStatus({
        message: 'Ya tienes una cuenta activa en la sesión. El nuevo registro la sobrescribirá.',
        type: 'warning'
      });
      // Continúa con el registro, permitiendo la sobrescritura
    }

    setIsLoading(true);
    setStatus({ message: 'Registrando cliente...', type: 'info' });

    try {
      const response = await registerClient(clientData);

      if (response.success) {
        setStatus({ message: '¡Registro exitoso! Cuenta creada y activa.', type: 'success' });
        // El estado de la billetera ya fue actualizado con document/phone en RegisterForm/handleRegister
        updateWalletData({
          document: clientData.document,
          phone: clientData.phone,
          balance: 0.00
        });
        setView(VIEWS.BALANCE);
      } else {
        setStatus({ message: response.message || 'Error en el registro', type: 'error' });
      }
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : 'Error desconocido de conexión/API.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (amount: number) => {
    setIsLoading(true);
    setStatus({ message: `Recargando ${amount.toFixed(2)} USD...`, type: 'info' });

    try {
      const response = await loadWallet({
        document: walletData.document,
        phone: walletData.phone,
        amount
      });

      if (response.success) {
        setStatus({ message: `¡Recarga exitosa! Se han añadido ${amount.toFixed(2)} USD.`, type: 'success' });
        // Forzar una consulta de saldo para obtener el balance actualizado de la API
        await handleCheckBalance();
      } else {
        setStatus({ message: response.message || 'Error en la recarga', type: 'error' });
      }
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : 'Error desconocido en la recarga.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (amount: number) => {
    setIsLoading(true);
    setStatus({ message: 'Iniciando proceso de pago (Fase 1/2)...', type: 'info' });

    try {
      // Fase 1: Inicialización del Pago
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

      // Fase 2: Confirmación del Pago
      const confirmResponse = await confirmPayment({ sessionId, token });

      if (!confirmResponse.success) {
        throw new Error(confirmResponse.message || 'Error al confirmar el pago.');
      }

      setStatus({ message: `¡Pago exitoso de ${amount.toFixed(2)} USD!`, type: 'success' });
      // Forzar una consulta de saldo para obtener el balance actualizado de la API
      await handleCheckBalance();
    } catch (error) {
      setStatus({
        message: `Transacción fallida: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renderiza el contenido principal basado en la vista actual
  const currentContent = useMemo(() => {
    // Si no hay documento o teléfono activo, excepto en la vista de registro, muestra un aviso.
    if (!walletData.document && view !== VIEWS.REGISTER) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800">Cuenta No Activa</h3>
          <p className="text-gray-600 mt-2">
            Por favor, <span className="font-semibold text-indigo-600">registra una cuenta</span> para acceder a las funciones de recarga, pago o saldo.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setView(VIEWS.REGISTER)}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition"
            >
              Ir a Registrar
            </button>
          </div>
        </div>
      );
    }

    switch (view) {
      case VIEWS.REGISTER:
        return (
          <RegisterForm
            onRegister={handleRegister}
            isLoading={isLoading}
            walletData={walletData}
            onUpdateWalletData={updateWalletData}
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
  }, [view, walletData, isLoading, isBalanceLoading, handleCheckBalance, updateWalletData, handleRegister, handleLoad, handlePayment, setView]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center font-['Inter']">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <Header />

        <div className="p-6">

          <StatusNotification
            notification={status}
            onClose={() => setStatus({ message: '', type: 'info' })}
          />

          <Navigation
            currentView={view}
            onViewChange={setView}
          />

          <div className="p-0 border-none rounded-xl bg-transparent">
            {currentContent}
          </div>

          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 shadow-inner">
            <p className="font-semibold mb-1 text-indigo-700">Cuenta Activa en Sesión:</p>
            <p className="flex justify-between flex-wrap">
              <span className="mr-4">
                Doc: <span className="font-mono bg-white px-2 py-1 rounded-md border border-gray-100 text-gray-600">{walletData.document || 'N/A'}</span>
              </span>
              <span>
                Tel: <span className="font-mono bg-white px-2 py-1 rounded-md border border-gray-100 text-gray-600">{walletData.phone || 'N/A'}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
