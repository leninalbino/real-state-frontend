import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash, Edit } from 'lucide-react';
import {
  getCharacteristics,
  createCharacteristic,
  updateCharacteristic,
  deleteCharacteristic,
  addCharacteristicOption,
  updateCharacteristicOption,
  deleteCharacteristicOption,
} from '../services/characteristicService';
import type {
  PropertyCharacteristic,
  CharacteristicOption,
} from '../services/characteristicService';

const CharacteristicsPage: React.FC = () => {
  const [characteristics, setCharacteristics] = useState<PropertyCharacteristic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCharacteristic, setEditingCharacteristic] = useState<PropertyCharacteristic | null>(null);
  const [editingOption, setEditingOption] = useState<CharacteristicOption | null>(null);
  const [characteristicForm, setCharacteristicForm] = useState({ label: '', key: '', type: 'text' });
  const [optionForm, setOptionForm] = useState({ label: '', value: '' });
  const navigate = useNavigate();

  const fetchCharacteristics = async () => {
    try {
      const response = await getCharacteristics();
      setCharacteristics(response);
    } catch (error) {
      console.error('Error fetching characteristics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacteristics();
  }, []);

  const handleCharacteristicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCharacteristic) {
        await updateCharacteristic(editingCharacteristic.id, characteristicForm);
      } else {
        await createCharacteristic(characteristicForm);
      }
      setCharacteristicForm({ label: '', key: '', type: 'text' });
      setEditingCharacteristic(null);
      fetchCharacteristics();
    } catch (error) {
      console.error('Error saving characteristic:', error);
    }
  };

  const handleOptionSubmit = async (e: React.FormEvent, characteristicId: string) => {
    e.preventDefault();
    try {
      if (editingOption) {
        await updateCharacteristicOption(editingOption.id, optionForm);
      } else {
        await addCharacteristicOption(characteristicId, optionForm);
      }
      setOptionForm({ label: '', value: '' });
      setEditingOption(null);
      fetchCharacteristics();
    } catch (error) {
      console.error('Error saving option:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 pt-16">
      <div className="flex items-center py-2 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-gray-700 hover:text-gray-900 transition-colors mr-2"
        >
          <ChevronLeft size={28} />
        </button>
        <h2 className="text-2xl font-semibold leading-tight">Manage Characteristics</h2>
      </div>

      {/* Form for Characteristics */}
      <div className="mb-8 p-4 border rounded shadow">
        <h3 className="text-lg font-semibold mb-4">{editingCharacteristic ? 'Edit' : 'Create'} Characteristic</h3>
        <form onSubmit={handleCharacteristicSubmit} className="space-y-4">
          {/* ... form inputs for characteristic ... */}
          <button type="submit" className="/* ... */">{editingCharacteristic ? 'Update' : 'Create'}</button>
          {editingCharacteristic && <button type="button" onClick={() => setEditingCharacteristic(null)}>Cancel</button>}
        </form>
      </div>

      {/* List of Characteristics */}
      <div className="space-y-8">
        {characteristics.map((char) => (
          <div key={char.id} className="p-4 border rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">{char.label}</h3>
                <p className="text-sm text-gray-500">{char.key} - {char.type}</p>
              </div>
              <div>
                <button onClick={() => setEditingCharacteristic(char)}><Edit size={20} /></button>
                <button onClick={async () => {
                  if (window.confirm('Are you sure?')) {
                    await deleteCharacteristic(char.id);
                    fetchCharacteristics();
                  }
                }}><Trash size={20} /></button>
              </div>
            </div>

            {/* Options */}
            {char.type === 'select' && (
              <div>
                <h4 className="font-semibold mb-2">Options</h4>
                {/* Form for Options */}
                <form onSubmit={(e) => handleOptionSubmit(e, char.id)} className="flex items-end space-x-2 mb-4">
                  {/* ... form inputs for option ... */}
                  <button type="submit"><Plus size={20} /></button>
                  {editingOption && <button type="button" onClick={() => setEditingOption(null)}>Cancel</button>}
                </form>
                {/* List of Options */}
                <ul className="space-y-2">
                  {char.options.map((opt) => (
                    <li key={opt.id} className="flex justify-between items-center">
                      <span>{opt.label} ({opt.value})</span>
                      <div>
                        <button onClick={() => setEditingOption(opt)}><Edit size={16} /></button>
                        <button onClick={async () => {
                          if (window.confirm('Are you sure?')) {
                            await deleteCharacteristicOption(opt.id);
                            fetchCharacteristics();
                          }
                        }}><Trash size={16} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacteristicsPage;
