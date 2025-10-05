export interface ContactOffice {
  _id?: string;
  region_name: string;
  region: string;
  country: string;
  office_name: string;
  address: string;
  phone: string;
  emails: string[];
  is_lab_facility: boolean;
  notes: string;
  image_url: string;
  region_order: number;
  office_order: number;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE = "https://cbm-backend-e1rq.onrender.com"

// Helper function to create FormData for file uploads
const createFormData = (data: Partial<ContactOffice>, file?: File): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'emails' && Array.isArray(value)) {
      formData.append(key, value.join(','));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  if (file) {
    formData.append('image', file);
  }
  
  return formData;
};

export async function listContactOffices(): Promise<ContactOffice[]> {
  const response = await fetch(`${API_BASE}/api/contact-offices/admin`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch contact offices');
  }
  
  const result = await response.json();
  return result.data || [];
}

export async function getContactOffice(id: string): Promise<ContactOffice> {
  const response = await fetch(`${API_BASE}/api/contact-offices/admin/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch contact office');
  }
  
  const result = await response.json();
  return result.data;
}

export async function createContactOffice(data: Partial<ContactOffice>, file?: File): Promise<ContactOffice> {
  const formData = createFormData(data, file);
  
  const response = await fetch(`${API_BASE}/api/contact-offices/admin`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create contact office');
  }
  
  const result = await response.json();
  return result.data;
}

export async function updateContactOffice(id: string, data: Partial<ContactOffice>, file?: File): Promise<ContactOffice> {
  const formData = createFormData(data, file);
  
  const response = await fetch(`${API_BASE}/api/contact-offices/admin/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update contact office');
  }
  
  const result = await response.json();
  return result.data;
}

export async function deleteContactOffice(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/contact-offices/admin/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete contact office');
  }
}
