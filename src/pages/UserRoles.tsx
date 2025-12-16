import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Check } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import type { Role, Permission } from '../types';

const AVAILABLE_ROUTES = [
    { path: '/', label: 'Dashboard' },
    { path: '/families', label: 'Families' },
    { path: '/payments', label: 'Payments' },
    { path: '/events', label: 'Events' },
    { path: '/settings', label: 'Settings' },
    { path: '/roles', label: 'User Roles' },
];

const PERMISSIONS: Permission[] = ['read', 'write', 'delete'];

const UserRoles: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([
        {
            id: '1',
            name: 'Administrator',
            description: 'Full access to all features',
            navigationPermissions: AVAILABLE_ROUTES.map(route => ({
                path: route.path,
                label: route.label,
                permissions: ['read', 'write', 'delete'] as Permission[],
            })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: '2',
            name: 'Viewer',
            description: 'Read-only access',
            navigationPermissions: AVAILABLE_ROUTES.map(route => ({
                path: route.path,
                label: route.label,
                permissions: ['read'] as Permission[],
            })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        navigationPermissions: AVAILABLE_ROUTES.map(route => ({
            path: route.path,
            label: route.label,
            permissions: [] as Permission[],
        })),
    });

    const handleOpenModal = (role?: Role) => {
        if (role) {
            setEditingRole(role);
            setFormData({
                name: role.name,
                description: role.description,
                navigationPermissions: role.navigationPermissions,
            });
        } else {
            setEditingRole(null);
            setFormData({
                name: '',
                description: '',
                navigationPermissions: AVAILABLE_ROUTES.map(route => ({
                    path: route.path,
                    label: route.label,
                    permissions: [],
                })),
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRole(null);
    };

    const togglePermission = (routePath: string, permission: Permission) => {
        setFormData(prev => ({
            ...prev,
            navigationPermissions: prev.navigationPermissions.map(nav =>
                nav.path === routePath
                    ? {
                        ...nav,
                        permissions: nav.permissions.includes(permission)
                            ? nav.permissions.filter(p => p !== permission)
                            : [...nav.permissions, permission],
                    }
                    : nav
            ),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingRole) {
            setRoles(roles.map(role =>
                role.id === editingRole.id
                    ? {
                        ...role,
                        ...formData,
                        updatedAt: new Date().toISOString(),
                    }
                    : role
            ));
        } else {
            const newRole: Role = {
                id: Date.now().toString(),
                ...formData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setRoles([...roles, newRole]);
        }

        handleCloseModal();
    };

    const handleDelete = (roleId: string) => {
        if (confirm('Are you sure you want to delete this role?')) {
            setRoles(roles.filter(role => role.id !== roleId));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Roles & Permissions</h1>
                    <p className="text-slate-500 mt-1">Manage user roles and their access permissions.</p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()}>
                    Create Role
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <Card key={role.id} className="hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Shield className="text-emerald-600" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{role.name}</h3>
                                    <p className="text-xs text-slate-500">{role.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <p className="text-xs font-medium text-slate-500 uppercase">Permissions</p>
                            <div className="flex flex-wrap gap-1">
                                {role.navigationPermissions.filter(nav => nav.permissions.length > 0).map(nav => (
                                    <Badge key={nav.path} variant="info">
                                        {nav.label}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-100">
                            <Button
                                variant="outline"
                                size="sm"
                                icon={Edit}
                                onClick={() => handleOpenModal(role)}
                                className="flex-1"
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                icon={Trash2}
                                onClick={() => handleDelete(role.id)}
                                className="flex-1"
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create/Edit Role Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingRole ? 'Edit Role' : 'Create New Role'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label="Role Name"
                            placeholder="e.g., Manager, Accountant"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Description"
                            placeholder="Brief description of this role"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Navigation & Permissions</h3>
                        <div className="space-y-3">
                            {formData.navigationPermissions.map(nav => (
                                <div key={nav.path} className="border border-slate-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium text-slate-900">{nav.label}</span>
                                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">{nav.path}</code>
                                    </div>
                                    <div className="flex gap-2">
                                        {PERMISSIONS.map(permission => (
                                            <label
                                                key={permission}
                                                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={nav.permissions.includes(permission)}
                                                    onChange={() => togglePermission(nav.path, permission)}
                                                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-sm capitalize">{permission}</span>
                                                {nav.permissions.includes(permission) && (
                                                    <Check size={14} className="text-emerald-600" />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                        <Button type="button" variant="outline" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingRole ? 'Update Role' : 'Create Role'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserRoles;
