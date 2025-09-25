// import { fetchSheet } from '@/lib/fetchers';
// import type { IndentSheet, InventorySheet, MasterSheet, PoMasterSheet, ReceivedSheet } from '@/types';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { toast } from 'sonner';

// interface SheetsState {
//     updateReceivedSheet: () => void;
//     updatePoMasterSheet: () => void;
//     updateIndentSheet: () => void;
//     updateAll: () => void;

//     indentSheet: IndentSheet[];
//     poMasterSheet: PoMasterSheet[];
//     receivedSheet: ReceivedSheet[];
//     inventorySheet: InventorySheet[];
//     masterSheet: MasterSheet | undefined;

//     indentLoading: boolean;
//     poMasterLoading: boolean;
//     receivedLoading: boolean;
//     inventoryLoading: boolean;
//     allLoading: boolean;
// }

// const SheetsContext = createContext<SheetsState | null>(null);

// export const SheetsProvider = ({ children }: { children: React.ReactNode }) => {
//     const [indentSheet, setIndentSheet] = useState<IndentSheet[]>([]);
//     const [receivedSheet, setReceivedSheet] = useState<ReceivedSheet[]>([]);
//     const [poMasterSheet, setPoMasterSheet] = useState<PoMasterSheet[]>([]);
//     const [inventorySheet, setInventorySheet] = useState<InventorySheet[]>([]);
//     const [masterSheet, setMasterSheet] = useState<MasterSheet>();

//     const [indentLoading, setIndentLoading] = useState(true);
//     const [poMasterLoading, setPoMasterLoading] = useState(true);
//     const [receivedLoading, setReceivedLoading] = useState(true);
//     const [inventoryLoading, setInventoryLoading] = useState(true);
//     const [allLoading, setAllLoading] = useState(true);

//     function updateIndentSheet() {
//         setIndentLoading(true);
//         fetchSheet('INDENT').then((res) => {
//             setIndentSheet(res as IndentSheet[]);
//             setIndentLoading(false);
//         });
//     }
//     function updateReceivedSheet() {
//         setReceivedLoading(true);
//         fetchSheet('RECEIVED').then((res) => {
//             setReceivedSheet(res as ReceivedSheet[]);
//             setReceivedLoading(false);
//         });
//     }

//     function updatePoMasterSheet() {
//         setPoMasterLoading(true);
//         fetchSheet('PO MASTER').then((res) => {
//             setPoMasterSheet(res as PoMasterSheet[]);
//             setPoMasterLoading(false);
//         });
//     }

//     function updateInventorySheet() {
//         setInventoryLoading(true);
//         fetchSheet('INVENTORY').then((res) => {
//             setInventorySheet(res as InventorySheet[]);
//             setInventoryLoading(false);
//         });
//     }
//     function updateMasterSheet() {
//         fetchSheet('MASTER').then((res) => {
//             setMasterSheet(res as MasterSheet);
//         });
//     }

//     function updateAll() {
//         setAllLoading(true);
//         updateMasterSheet();
//         updateReceivedSheet();
//         updateIndentSheet();
//         updatePoMasterSheet();
//         updateInventorySheet();
//         setAllLoading(false);
//     }

//     useEffect(() => {
//         try {
//             updateAll();
//             toast.success('Fetched all the data');
//         } catch (e) {
//             toast.error('Something went wrong while fetching data');
//         } finally {
//         }
//     }, []);

//     return (
//         <SheetsContext.Provider
//             value={{
//                 updateIndentSheet,
//                 updatePoMasterSheet,
//                 updateReceivedSheet,
//                 updateAll,
//                 indentSheet,
//                 poMasterSheet,
//                 inventorySheet,
//                 receivedSheet,
//                 indentLoading,
//                 masterSheet,
//                 poMasterLoading,
//                 receivedLoading,
//                 inventoryLoading,
//                 allLoading,
//             }}
//         >
//             {children}
//         </SheetsContext.Provider>
//     );
// };

// export const useSheets = () => useContext(SheetsContext)!;



import { fetchSheet } from '@/lib/fetchers';
import type { IndentSheet, InventorySheet, MasterSheet, PoMasterSheet, ReceivedSheet, UserSheet } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SheetsState {
    updateReceivedSheet: () => void;
    updatePoMasterSheet: () => void;
    updateIndentSheet: () => void;
    updateUserSheet: () => void;
    updateAll: () => void;

    indentSheet: IndentSheet[];
    poMasterSheet: PoMasterSheet[];
    receivedSheet: ReceivedSheet[];
    inventorySheet: InventorySheet[];
    userSheet: UserSheet[];
    masterSheet: MasterSheet | undefined;

    indentLoading: boolean;
    poMasterLoading: boolean;
    receivedLoading: boolean;
    inventoryLoading: boolean;
    userLoading: boolean;
    allLoading: boolean;
}

const SheetsContext = createContext<SheetsState | null>(null);

export const SheetsProvider = ({ children }: { children: React.ReactNode }) => {
    const [indentSheet, setIndentSheet] = useState<IndentSheet[]>([]);
    const [receivedSheet, setReceivedSheet] = useState<ReceivedSheet[]>([]);
    const [poMasterSheet, setPoMasterSheet] = useState<PoMasterSheet[]>([]);
    const [inventorySheet, setInventorySheet] = useState<InventorySheet[]>([]);
    const [userSheet, setUserSheet] = useState<UserSheet[]>([]);
    const [masterSheet, setMasterSheet] = useState<MasterSheet>();

    const [indentLoading, setIndentLoading] = useState(true);
    const [poMasterLoading, setPoMasterLoading] = useState(true);
    const [receivedLoading, setReceivedLoading] = useState(true);
    const [inventoryLoading, setInventoryLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const [allLoading, setAllLoading] = useState(true);

    function updateIndentSheet() {
        setIndentLoading(true);
        fetchSheet('INDENT').then((res) => {
            setIndentSheet(res as IndentSheet[]);
            setIndentLoading(false);
        });
    }

    function updateReceivedSheet() {
        setReceivedLoading(true);
        fetchSheet('RECEIVED').then((res) => {
            setReceivedSheet(res as ReceivedSheet[]);
            setReceivedLoading(false);
        });
    }

    function updatePoMasterSheet() {
        setPoMasterLoading(true);
        fetchSheet('PO MASTER').then((res) => {
            setPoMasterSheet(res as PoMasterSheet[]);
            setPoMasterLoading(false);
        });
    }

    function updateInventorySheet() {
        setInventoryLoading(true);
        fetchSheet('INVENTORY').then((res) => {
            setInventorySheet(res as InventorySheet[]);
            setInventoryLoading(false);
        });
    }

    function updateUserSheet() {
        setUserLoading(true);
        fetchSheet('USER').then((res) => {
            setUserSheet(res as UserSheet[]);
            setUserLoading(false);
        });
    }

    // function updateMasterSheet() {
    //     fetchSheet('MASTER').then((res) => {
    //         setMasterSheet(res as MasterSheet);
    //     });
    // }
    function updateMasterSheet() {
    fetchSheet('MASTER').then((res) => {
        console.log('Master sheet response:', res);
        
        // Ab backend se directly approveVendorNames aa jayega
        let approveVendorNames = [];
        
        if (res && res.approveVendorNames && Array.isArray(res.approveVendorNames)) {
            approveVendorNames = res.approveVendorNames
                .filter(name => name && name.trim() !== '')
                .filter((name, index, arr) => arr.indexOf(name) === index);
        }
        
        console.log('Approve vendor names from column S:', approveVendorNames);

        setMasterSheet({
            ...res,
            approveVendorNames
        } as MasterSheet);
    }).catch(error => {
        console.error('Error in updateMasterSheet:', error);
    });
}

    function updateAll() {
        setAllLoading(true);
        updateMasterSheet();
        updateReceivedSheet();
        updateIndentSheet();
        updatePoMasterSheet();
        updateInventorySheet();
        updateUserSheet();
        setAllLoading(false);
    }

    useEffect(() => {
        try {
            updateAll();
            toast.success('Fetched all the data');
        } catch (e) {
            toast.error('Something went wrong while fetching data');
        } finally {
        }
    }, []);

    return (
        <SheetsContext.Provider
            value={{
                updateIndentSheet,
                updatePoMasterSheet,
                updateReceivedSheet,
                updateUserSheet,
                updateAll,
                indentSheet,
                poMasterSheet,
                inventorySheet,
                receivedSheet,
                userSheet,
                indentLoading,
                masterSheet,
                poMasterLoading,
                receivedLoading,
                inventoryLoading,
                userLoading,
                allLoading,
            }}
        >
            {children}
        </SheetsContext.Provider>
    );
};

export const useSheets = () => useContext(SheetsContext)!;