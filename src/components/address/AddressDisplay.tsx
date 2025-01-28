import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CurrentAddress } from "./CurrentAddress";
import { AddressHistory } from "./AddressHistory";
import { AddNewAddress } from "./AddNewAddress";
import { Json } from "@/integrations/supabase/types";

type AddressHistoryEntry = {
  street_address: string;
  postal_code: string;
  city: string;
  created_at: string;
  deleted_at: string;
}

interface AddressData {
  street_address: string | null;
  postal_code: string | null;
  city: string | null;
  address: string | null;
  created_at: string;
  deleted_at: string | null;
  address_history: AddressHistoryEntry[];
}

export const AddressDisplay = ({ onAddressUpdate }: { onAddressUpdate: () => void }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAddress = async () => {
    try {
      console.log('Fetching address...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log('No user session found');
        return;
      }

      const { data, error } = await supabase
        .from('customer_checklist_progress')
        .select('street_address, postal_code, city, address, created_at, deleted_at, address_history')
        .eq('customer_id', session.user.id)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) {
        console.error('Error fetching address:', error);
        throw error;
      }
      
      console.log('Fetched address data:', data);
      // Cast the address_history to the correct type
      if (data) {
        const typedData: AddressData = {
          ...data,
          address_history: data.address_history as AddressHistoryEntry[] || []
        };
        setAddressData(typedData);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const handleAddressUpdate = () => {
    console.log('Address updated, refetching...');
    fetchAddress();
    setIsOpen(false);
    onAddressUpdate();
  };

  const handleDeleteAddress = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      if (!addressData) return;

      const historyEntry: AddressHistoryEntry = {
        street_address: addressData.street_address!,
        postal_code: addressData.postal_code!,
        city: addressData.city!,
        created_at: addressData.created_at,
        deleted_at: new Date().toISOString(),
      };

      const newHistory = addressData.address_history 
        ? [...addressData.address_history, historyEntry]
        : [historyEntry];

      const { error } = await supabase
        .from('customer_checklist_progress')
        .update({
          street_address: null,
          postal_code: null,
          city: null,
          address: null,
          deleted_at: new Date().toISOString(),
          address_history: newHistory
        })
        .eq('customer_id', session.user.id);

      if (error) throw error;

      toast({
        title: language === 'sv' ? "Adress borttagen" : "Address deleted",
        description: language === 'sv' 
          ? "Din adress har tagits bort och sparats i historiken" 
          : "Your address has been deleted and saved in history",
      });

      fetchAddress();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: language === 'sv' ? "Ett fel uppstod" : "An error occurred",
        description: language === 'sv' 
          ? "Det gick inte att ta bort adressen" 
          : "Could not delete the address",
        variant: "destructive"
      });
    }
  };

  const hasCurrentAddress = Boolean(
    addressData && 
    addressData.street_address && 
    addressData.postal_code && 
    addressData.city &&
    !addressData.deleted_at
  );

  console.log('Current address conditions:', {
    addressData,
    hasCurrentAddress,
    conditions: {
      hasData: Boolean(addressData),
      hasStreet: Boolean(addressData?.street_address),
      hasPostal: Boolean(addressData?.postal_code),
      hasCity: Boolean(addressData?.city),
      notDeleted: !addressData?.deleted_at
    }
  });
  
  return (
    <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-[4px] shadow-sm border border-[#e5e7eb] dark:border-[#232325] transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">
        {language === 'sv' ? 'Din adress' : 'Your Address'}
      </h2>
      
      {!hasCurrentAddress && (
        <AddNewAddress 
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSuccess={handleAddressUpdate}
        />
      )}

      {hasCurrentAddress && addressData && (
        <CurrentAddress 
          addressData={{
            street_address: addressData.street_address!,
            postal_code: addressData.postal_code!,
            city: addressData.city!,
            created_at: addressData.created_at
          }}
          onDelete={handleDeleteAddress}
        />
      )}

      {addressData?.address_history && addressData.address_history.length > 0 && (
        <AddressHistory history={addressData.address_history} />
      )}
    </div>
  );
};