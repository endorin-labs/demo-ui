// components/Promptbar/components/CreateAgentModal.tsx
import { FC, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
    onClose: () => void;
    onCreate: (data: { name: string; description: string; knowledgeBase: string }) => void;
}

export const CreateAgentModal: FC<Props> = ({ onClose, onCreate }) => {
    const { t } = useTranslation('promptbar');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [knowledgeBase, setKnowledgeBase] = useState('');

    const modalRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        nameInputRef.current?.focus();
    }, []);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCreate();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleCreate = () => {
        if (!name || !knowledgeBase) {
            alert(t('Please fill out all required fields.'));
            return;
        }
        onCreate({ name, description, knowledgeBase });
        onClose();
    };

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onKeyDown={handleKeyDown}
        >
            <div
                ref={modalRef}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-xl font-bold mb-4">{t('Create Agent')}</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">{t('Name')}</label>
                    <input
                        ref={nameInputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder={t('Enter agent name')}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">{t('Description')}</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder={t('Enter description')}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">{t('Knowledge Base')}</label>
                    <textarea
                        value={knowledgeBase}
                        onChange={(e) => setKnowledgeBase(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder={t('Enter knowledge base content')}
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="w-full bg-blue-500 text-white py-2 rounded"
                >
                    {t('Save')}
                </button>
            </div>
        </div>
    );
};