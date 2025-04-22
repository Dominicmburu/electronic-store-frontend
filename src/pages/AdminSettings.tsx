// pages/settings/Settings.tsx
import React, { useState, useEffect } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import '../styles/Admin/Settings.css';

interface StoreSettings {
    general: {
        storeName: string;
        storeEmail: string;
        storePhone: string;
        storeAddress: string;
        storeLogo: string;
        currencySymbol: string;
        timeZone: string;
    };
    payment: {
        acceptedMethods: string[];
        paypalEmail: string;
        bankDetails: string;
        mobileMoney: {
            enabled: boolean;
            providers: string[];
        };
    };
    shipping: {
        methods: {
            id: string;
            name: string;
            cost: number;
            enabled: boolean;
        }[];
        freeShippingThreshold: number;
    };
    email: {
        fromName: string;
        fromEmail: string;
        emailTemplate: string;
        orderConfirmation: boolean;
        paymentConfirmation: boolean;
        shippingConfirmation: boolean;
    };
}

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock settings data
                const mockSettings: StoreSettings = {
                    general: {
                        storeName: 'PrinterShop Kenya',
                        storeEmail: 'info@printershop.co.ke',
                        storePhone: '+254 712 345678',
                        storeAddress: '123 Business Street, Nairobi, Kenya',
                        storeLogo: '/assets/logo.png',
                        currencySymbol: 'KES',
                        timeZone: 'Africa/Nairobi'
                    },
                    payment: {
                        acceptedMethods: ['Credit Card', 'PayPal', 'Bank Transfer', 'Mobile Money'],
                        paypalEmail: 'payments@printershop.co.ke',
                        bankDetails: 'Bank: Kenya Commercial Bank\nAccount: 1234567890\nBranch: Main Branch',
                        mobileMoney: {
                            enabled: true,
                            providers: ['M-Pesa', 'Airtel Money']
                        }
                    },
                    shipping: {
                        methods: [
                            {
                                id: 'standard',
                                name: 'Standard Shipping',
                                cost: 500,
                                enabled: true
                            },
                            {
                                id: 'express',
                                name: 'Express Shipping',
                                cost: 1000,
                                enabled: true
                            },
                            {
                                id: 'pickup',
                                name: 'Store Pickup',
                                cost: 0,
                                enabled: true
                            }
                        ],
                        freeShippingThreshold: 10000
                    },
                    email: {
                        fromName: 'PrinterShop Support',
                        fromEmail: 'support@printershop.co.ke',
                        emailTemplate: 'default',
                        orderConfirmation: true,
                        paymentConfirmation: true,
                        shippingConfirmation: true
                    }
                };

                setSettings(mockSettings);
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleInputChange = (section: keyof StoreSettings, field: string, value: any) => {
        if (!settings) return;

        setSettings({
            ...settings,
            [section]: {
                ...settings[section],
                [field]: value
            }
        });

        setHasChanges(true);
    };

    const handleNestedInputChange = (section: keyof StoreSettings, parent: string, field: string, value: any) => {
        if (!settings) return;

        setSettings({
            ...settings,
            [section]: {
                ...settings[section],
                [parent]: {
                    ...settings[section][parent as keyof typeof settings[typeof section]],
                    [field]: value
                }
            }
        });

        setHasChanges(true);
    };

    const handleCheckboxChange = (section: keyof StoreSettings, field: string, checked: boolean) => {
        if (!settings) return;

        setSettings({
            ...settings,
            [section]: {
                ...settings[section],
                [field]: checked
            }
        });

        setHasChanges(true);
    };

    const handleArrayChange = (section: keyof StoreSettings, field: string, value: string[]) => {
        if (!settings) return;

        setSettings({
            ...settings,
            [section]: {
                ...settings[section],
                [field]: value
            }
        });

        setHasChanges(true);
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);

        // Simulate API call to save settings
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSaving(false);
        setHasChanges(false);

        // Show success message
        alert('Settings saved successfully!');
    };

    const renderGeneralSettings = () => {
        if (!settings) return null;

        return (
            <div className="general-settings">
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>Store Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.general.storeName}
                                onChange={(e) => handleInputChange('general', 'storeName', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>Store Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={settings.general.storeEmail}
                                onChange={(e) => handleInputChange('general', 'storeEmail', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>Store Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.general.storePhone}
                                onChange={(e) => handleInputChange('general', 'storePhone', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>Currency Symbol</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.general.currencySymbol}
                                onChange={(e) => handleInputChange('general', 'currencySymbol', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 mb-4">
                        <div className="form-group">
                            <label>Store Address</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={settings.general.storeAddress}
                                onChange={(e) => handleInputChange('general', 'storeAddress', e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>Time Zone</label>
                            <select
                                className="form-control"
                                value={settings.general.timeZone}
                                onChange={(e) => handleInputChange('general', 'timeZone', e.target.value)}
                            >
                                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                                <option value="UTC">Coordinated Universal Time (UTC)</option>
                                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                                <option value="America/New_York">Eastern Time (ET)</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>Store Logo</label>
                            <div className="custom-file">
                                <input type="file" className="custom-file-input" id="storeLogo" />
                                <label className="custom-file-label" htmlFor="storeLogo">Choose file</label>
                            </div>
                            <small className="form-text text-muted">Recommended size: 200x60 pixels</small>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPaymentSettings = () => {
        if (!settings) return null;

        return (
            <div className="payment-settings">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <div className="form-group">
                            <label>Accepted Payment Methods</label>
                            <div className="payment-methods-container">
                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="creditCard"
                                        checked={settings.payment.acceptedMethods.includes('Credit Card')}
                                        onChange={(e) => {
                                            const methods = e.target.checked
                                                ? [...settings.payment.acceptedMethods, 'Credit Card']
                                                : settings.payment.acceptedMethods.filter(m => m !== 'Credit Card');
                                            handleArrayChange('payment', 'acceptedMethods', methods);
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="creditCard">Credit Card</label>
                                </div>

                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="paypal"
                                        checked={settings.payment.acceptedMethods.includes('PayPal')}
                                        onChange={(e) => {
                                            const methods = e.target.checked
                                                ? [...settings.payment.acceptedMethods, 'PayPal']
                                                : settings.payment.acceptedMethods.filter(m => m !== 'PayPal');
                                            handleArrayChange('payment', 'acceptedMethods', methods);
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="paypal">PayPal</label>
                                </div>

                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="bankTransfer"
                                        checked={settings.payment.acceptedMethods.includes('Bank Transfer')}
                                        onChange={(e) => {
                                            const methods = e.target.checked
                                                ? [...settings.payment.acceptedMethods, 'Bank Transfer']
                                                : settings.payment.acceptedMethods.filter(m => m !== 'Bank Transfer');
                                            handleArrayChange('payment', 'acceptedMethods', methods);
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="bankTransfer">Bank Transfer</label>
                                </div>

                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="mobileMoney"
                                        checked={settings.payment.acceptedMethods.includes('Mobile Money')}
                                        onChange={(e) => {
                                            const methods = e.target.checked
                                                ? [...settings.payment.acceptedMethods, 'Mobile Money']
                                                : settings.payment.acceptedMethods.filter(m => m !== 'Mobile Money');
                                            handleArrayChange('payment', 'acceptedMethods', methods);
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor="mobileMoney">Mobile Money</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>PayPal Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={settings.payment.paypalEmail}
                                onChange={(e) => handleInputChange('payment', 'paypalEmail', e.target.value)}
                                disabled={!settings.payment.acceptedMethods.includes('PayPal')}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>Mobile Money</label>
                            <div className="custom-control custom-switch mb-2">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="enableMobileMoney"
                                    checked={settings.payment.mobileMoney.enabled}
                                    onChange={(e) => handleNestedInputChange('payment', 'mobileMoney', 'enabled', e.target.checked)}
                                    disabled={!settings.payment.acceptedMethods.includes('Mobile Money')}
                                />
                                <label className="custom-control-label" htmlFor="enableMobileMoney">
                                    Enable Mobile Money
                                </label>
                            </div>

                            <div className="mobile-money-providers">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter providers (comma separated)"
                                    value={settings.payment.mobileMoney.providers.join(', ')}
                                    onChange={(e) => {
                                        const providers = e.target.value.split(',').map(p => p.trim()).filter(p => p);
                                        handleNestedInputChange('payment', 'mobileMoney', 'providers', providers);
                                    }}
                                    disabled={!settings.payment.acceptedMethods.includes('Mobile Money') || !settings.payment.mobileMoney.enabled}
                                />
                                <small className="form-text text-muted">e.g. M-Pesa, Airtel Money</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 mb-4">
                        <div className="form-group">
                            <label>Bank Details</label>
                            <textarea
                                className="form-control"
                                rows={4}
                                value={settings.payment.bankDetails}
                                onChange={(e) => handleInputChange('payment', 'bankDetails', e.target.value)}
                                disabled={!settings.payment.acceptedMethods.includes('Bank Transfer')}
                            ></textarea>
                            <small className="form-text text-muted">Enter bank details for bank transfers</small>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    const renderShippingSettings = () => {
        if (!settings) return null;

        return (
            <div className="shipping-settings">
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>Free Shipping Threshold</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">{settings.general.currencySymbol}</span>
                                </div>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={settings.shipping.freeShippingThreshold}
                                    onChange={(e) => handleInputChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                                />
                            </div>
                            <small className="form-text text-muted">Set to 0 to disable free shipping</small>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 mb-4">
                        <label>Shipping Methods</label>

                        {settings.shipping.methods.map((method, index) => (
                            <div key={method.id} className="card mb-3">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <div className="form-group mb-md-0">
                                                <label>Method Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={method.name}
                                                    onChange={(e) => {
                                                        const updatedMethods = [...settings.shipping.methods];
                                                        updatedMethods[index].name = e.target.value;
                                                        handleInputChange('shipping', 'methods', updatedMethods);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 mb-3 mb-md-0">
                                            <div className="form-group mb-md-0">
                                                <label>Cost</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text">{settings.general.currencySymbol}</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={method.cost}
                                                        onChange={(e) => {
                                                            const updatedMethods = [...settings.shipping.methods];
                                                            updatedMethods[index].cost = parseFloat(e.target.value);
                                                            handleInputChange('shipping', 'methods', updatedMethods);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 mb-3 mb-md-0">
                                            <div className="form-group d-flex align-items-end h-100 mb-0">
                                                <div className="custom-control custom-switch">
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id={`enableShipping${index}`}
                                                        checked={method.enabled}
                                                        onChange={(e) => {
                                                            const updatedMethods = [...settings.shipping.methods];
                                                            updatedMethods[index].enabled = e.target.checked;
                                                            handleInputChange('shipping', 'methods', updatedMethods);
                                                        }}
                                                    />
                                                    <label className="custom-control-label" htmlFor={`enableShipping${index}`}>
                                                        {method.enabled ? 'Enabled' : 'Disabled'}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group d-flex align-items-end h-100 mb-0">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-sm btn-block"
                                                    onClick={() => {
                                                        const updatedMethods = settings.shipping.methods.filter((_, i) => i !== index);
                                                        handleInputChange('shipping', 'methods', updatedMethods);
                                                    }}
                                                >
                                                    <i className="material-icons">delete</i> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                                const newMethod = {
                                    id: `method-${Date.now()}`,
                                    name: 'New Shipping Method',
                                    cost: 0,
                                    enabled: true
                                };
                                handleInputChange('shipping', 'methods', [...settings.shipping.methods, newMethod]);
                            }}
                        >
                            <i className="material-icons">add</i> Add Shipping Method
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderEmailSettings = () => {
        if (!settings) return null;

        return (
            <div className="email-settings">
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>From Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.email.fromName}
                                onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>From Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={settings.email.fromEmail}
                                onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-4">
                        <div className="form-group">
                            <label>Email Template</label>
                            <select
                                className="form-control"
                                value={settings.email.emailTemplate}
                                onChange={(e) => handleInputChange('email', 'emailTemplate', e.target.value)}
                            >
                                <option value="default">Default Template</option>
                                <option value="minimal">Minimal Template</option>
                                <option value="modern">Modern Template</option>
                                <option value="branded">Branded Template</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 mb-4">
                        <label>Email Notifications</label>
                        <div className="card">
                            <div className="card-body">
                                <div className="custom-control custom-checkbox mb-3">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="orderConfirmation"
                                        checked={settings.email.orderConfirmation}
                                        onChange={(e) => handleCheckboxChange('email', 'orderConfirmation', e.target.checked)}
                                    />
                                    <label className="custom-control-label" htmlFor="orderConfirmation">
                                        Order Confirmation
                                    </label>
                                    <small className="form-text text-muted">
                                        Send an email when a new order is placed
                                    </small>
                                </div>

                                <div className="custom-control custom-checkbox mb-3">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="paymentConfirmation"
                                        checked={settings.email.paymentConfirmation}
                                        onChange={(e) => handleCheckboxChange('email', 'paymentConfirmation', e.target.checked)}
                                    />
                                    <label className="custom-control-label" htmlFor="paymentConfirmation">
                                        Payment Confirmation
                                    </label>
                                    <small className="form-text text-muted">
                                        Send an email when a payment is received
                                    </small>
                                </div>

                                <div className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id="shippingConfirmation"
                                        checked={settings.email.shippingConfirmation}
                                        onChange={(e) => handleCheckboxChange('email', 'shippingConfirmation', e.target.checked)}
                                    />
                                    <label className="custom-control-label" htmlFor="shippingConfirmation">
                                        Shipping Confirmation
                                    </label>
                                    <small className="form-text text-muted">
                                        Send an email when an order is shipped
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 mb-4">
                        <button type="button" className="btn btn-outline-primary">
                            <i className="material-icons mr-1">send</i> Send Test Email
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="settings-container">
            <PageHeader
                title="Settings"
                subtitle="Configure your store settings"
                actions={
                    <button
                        className="btn btn-success"
                        onClick={handleSaveSettings}
                        disabled={isSaving || !hasChanges}
                    >
                        {isSaving ? (
                            <>
                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="material-icons mr-1">save</i> Save Changes
                            </>
                        )}
                    </button>
                }
            />

            <div className="row">
                <div className="col-12">
                    <DashboardCard>
                        <ul className="nav nav-tabs mb-4" id="settingsTabs" role="tablist">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                                    href="#"
                                    onClick={() => setActiveTab('general')}
                                >
                                    <i className="material-icons mr-1">store</i> General
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'payment' ? 'active' : ''}`}
                                    href="#"
                                    onClick={() => setActiveTab('payment')}
                                >
                                    <i className="material-icons mr-1">payments</i> Payment
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'shipping' ? 'active' : ''}`}
                                    href="#"
                                    onClick={() => setActiveTab('shipping')}
                                >
                                    <i className="material-icons mr-1">local_shipping</i> Shipping
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'email' ? 'active' : ''}`}
                                    href="#"
                                    onClick={() => setActiveTab('email')}
                                >
                                    <i className="material-icons mr-1">email</i> Email
                                </a>
                            </li>
                        </ul>

                        <div className="tab-content">
                            {activeTab === 'general' && renderGeneralSettings()}
                            {activeTab === 'payment' && renderPaymentSettings()}
                            {activeTab === 'shipping' && renderShippingSettings()}
                            {activeTab === 'email' && renderEmailSettings()}
                        </div>

                        <div className="mt-4 d-flex justify-content-end">
                            <button
                                className="btn btn-success"
                                onClick={handleSaveSettings}
                                disabled={isSaving || !hasChanges}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="material-icons mr-1">save</i> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
};

export default Settings;