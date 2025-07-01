import React, { useEffect, useState } from 'react';
import { Calendar, FileText, DollarSign, Save, ChevronDown, Edit } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { SpinnerRelative } from '../../helper/spinner';
import { fetchAssetsStoreInternal } from '../../actions/get';

// untuk component ui update sama menggunakan input general journal
export const useHandleDataUpdateGeneralJournal = (data) => {
    const [selectedType, setSelectedType] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [formData, setFormData] = useState({});
  
    useEffect(() => {
      if (data && data.detail) {
        const { account_name, detail } = data;
        const { type, ...filteredDetail } = detail;
  
        setSelectedAccount(account_name);
        setSelectedType(type);
        setFormData(filteredDetail);
      }
    }, [data]);
  
    return { selectedAccount, selectedType, formData };
  };
  
  
