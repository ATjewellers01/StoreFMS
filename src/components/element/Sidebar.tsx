// import {
//     Sidebar,
//     SidebarContent,
//     SidebarGroup,
//     SidebarMenu,
//     SidebarMenuItem,
//     SidebarMenuButton,
//     SidebarHeader,
//     SidebarFooter,
//     SidebarSeparator,
// } from '@/components/ui/sidebar';
// import { useAuth } from '@/context/AuthContext';
// import { useSheets } from '@/context/SheetsContext';
// import type { RouteAttributes } from '@/types';
// import { LogOut, RotateCw, ShoppingCart } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import Logo from './Logo';

// export default ({ items }: { items: RouteAttributes[] }) => {
//     const navigate = useNavigate();
//     const { indentSheet, updateAll, allLoading } = useSheets();
//     const { user, logout } = useAuth();

//     // Add Get Purchase item to the existing items
//     const allItems = [
//         ...items,
//     ];
//   const hasPermission = (routeItem: RouteAttributes) => {
//         // Map actual route paths to UserSheet permission keys
//         const pathToPermissionMap: Record<string, keyof UserSheet> = {
//             'administration': 'administrate',
//             'create-indent': 'createIndent',
//             'create-po': 'createPo',
//             'get-purchase': 'getPurchase',
//             'approve-indent': 'indentApprovalView', // Uses View permission as per gateKey
//             'po-history': 'ordersView',
//             'pending-pos': 'pendingIndentsView',
//             'receive-items': 'receiveItemView', // Uses View permission as per gateKey
//             'store-out-approval': 'storeOutApprovalView', // Uses View permission as per gateKey
//             'three-party-approval': 'threePartyApprovalView', // Uses View permission as per gateKey
//             'vendor-rate-update': 'updateVendorView', // Uses View permission as per gateKey
//             // Note: Dashboard ('') and Inventory don't have gateKey, so they'll show by default
//         };

//         const permissionKey = pathToPermissionMap[routeItem.path];
//         if (!permissionKey) return true; // If no mapping found, show by default (like Dashboard, Inventory, PO Master)
        
//         // Check if user has 'TRUE' value for this permission (case-insensitive)
//         const userPermission = user[permissionKey];
//         return userPermission?.toString().toUpperCase() === 'TRUE';
//     };

//     // Filter items based on user permissions
//     const filteredItems = items.filter((item) => {
//         // First check existing gateKey condition
//         if (item.gateKey && user[item.gateKey] === 'No Access') {
//             return false;
//         }
        
//         // Then check new permission-based condition using the item itself
//         return hasPermission(item);
//     });
//    return (
//         <Sidebar side="left" variant="inset" collapsible="offcanvas">
//             <SidebarHeader className="p-3 border-b-1">
//                 <div className="flex justify-between items-start">
//                     <div className="flex items-center gap-2">
//                         <Logo />
//                         <div>
//                             <h2 className="text-xl font-bold">Store App</h2>
//                             <p className="text-sm">Management System</p>
//                         </div>
//                     </div>
//                     <Button variant="ghost" className="size-7" onClick={() => updateAll()} disabled={allLoading}>
//                         <RotateCw />
//                     </Button>
//                 </div>
//                 <SidebarSeparator />
//                 <div className="flex justify-between items-center px-3 text-xs text-muted-foreground">
//                     <div>
//                         <p>
//                             Name: <span className="font-semibold">{user.name}</span>
//                         </p>
//                         <p>
//                             Username: <span className="font-semibold">{user.username}</span>
//                         </p>
//                     </div>
//                     <Button variant="outline" className="size-8" onClick={() => logout()}>
//                         <LogOut />
//                     </Button>
//                 </div>
//             </SidebarHeader>
//             <SidebarContent className="py-1 border-b-1">
//                 <SidebarGroup>
//                     <SidebarMenu>
//                         {filteredItems.map((item, i) => (
//                             <SidebarMenuItem key={i}>
//                                 <SidebarMenuButton
//                                     className="transition-colors duration-200 rounded-md py-5 flex justify-between font-medium text-secondary-foreground"
//                                     onClick={() => navigate(item.path)}
//                                     isActive={window.location.pathname.slice(1) === item.path}
//                                 >
//                                     <div className="flex gap-2 items-center">
//                                         {item.icon}
//                                         {item.name}
//                                     </div>
//                                     {item.notifications(indentSheet) !== 0 && (
//                                         <span className="bg-destructive text-secondary w-[1.3rem] h-[1.3rem] rounded-full text-xs grid place-items-center text-center">
//                                             {item.notifications(indentSheet)}
//                                         </span>
//                                     )}
//                                 </SidebarMenuButton>
//                             </SidebarMenuItem>
//                         ))}
//                     </SidebarMenu>
//                 </SidebarGroup>
//             </SidebarContent>
//             <SidebarFooter>
//                 <div className="p-2 text-center text-sm">
//                     Powered by &#8208;{' '}
//                     <a className="text-primary" href="https://botivate.in" target="_blank">
//                         Botivate
//                     </a>
//                 </div>
//             </SidebarFooter>
//         </Sidebar>
//     );

// };



import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarFooter,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { useSheets } from '@/context/SheetsContext';
import type { RouteAttributes, UserSheet } from '@/types';
import { LogOut, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { useMemo } from 'react';

export default ({ items }: { items: RouteAttributes[] }) => {
    const navigate = useNavigate();
    const { indentSheet, updateAll, allLoading } = useSheets();
    const { user, logout } = useAuth();

    // Memoize the permission checking function to avoid re-creation on every render
    const hasPermission = useMemo(() => {
        return (routeItem: RouteAttributes) => {
            // Map actual route paths to UserSheet permission keys
            const pathToPermissionMap: Record<string, keyof UserSheet> = {
                'administration': 'administrate',
                'create-indent': 'createIndent',
                'create-po': 'createPo',
                'get-purchase': 'getPurchase',
                'approve-indent': 'indentApprovalView',
                'po-history': 'ordersView',
                'pending-pos': 'pendingIndentsView',
                'receive-items': 'receiveItemView',
                'store-out-approval': 'storeOutApprovalView',
                'three-party-approval': 'threePartyApprovalView',
                'vendor-rate-update': 'updateVendorView',
            };

            const permissionKey = pathToPermissionMap[routeItem.path];
            if (!permissionKey) return true; // Show by default if no mapping found
            
            // Check if user has 'TRUE' value for this permission
            const userPermission = user?.[permissionKey];
            return userPermission === true || userPermission === 'TRUE' || userPermission?.toString().toUpperCase() === 'TRUE';
        };
    }, [user]);

    // Memoize filtered items to prevent unnecessary re-renders
    const filteredItems = useMemo(() => {
        if (!user) return [];
        
        return items.filter((item) => {
            // First check existing gateKey condition
            if (item.gateKey && user[item.gateKey] === 'No Access') {
                return false;
            }
            
            // Then check new permission-based condition
            return hasPermission(item);
        });
    }, [items, user, hasPermission]);

    // Early return if user is not loaded
    if (!user) {
        return null;
    }

    return (
        <Sidebar side="left" variant="inset" collapsible="offcanvas">
            <SidebarHeader className="p-3 border-b-1">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Logo />
                        <div>
                            <h2 className="text-xl font-bold">Store App</h2>
                            <p className="text-sm">Management System</p>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        className="size-7" 
                        onClick={() => updateAll()} 
                        disabled={allLoading}
                    >
                        <RotateCw />
                    </Button>
                </div>
                <SidebarSeparator />
                <div className="flex justify-between items-center px-3 text-xs text-muted-foreground">
                    <div>
                        <p>
                            Name: <span className="font-semibold">{user.name}</span>
                        </p>
                        <p>
                            Username: <span className="font-semibold">{user.username}</span>
                        </p>
                    </div>
                    <Button variant="outline" className="size-8" onClick={() => logout()}>
                        <LogOut />
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent className="py-1 border-b-1">
                <SidebarGroup>
                    <SidebarMenu>
                        {filteredItems.map((item, i) => (
                            <SidebarMenuItem key={`${item.path}-${i}`}>
                                <SidebarMenuButton
                                    className="transition-colors duration-200 rounded-md py-5 flex justify-between font-medium text-secondary-foreground"
                                    onClick={() => navigate(item.path)}
                                    isActive={window.location.pathname.slice(1) === item.path}
                                >
                                    <div className="flex gap-2 items-center">
                                        {item.icon}
                                        {item.name}
                                    </div>
                                    {item.notifications && item.notifications(indentSheet || []) !== 0 && (
                                        <span className="bg-destructive text-secondary w-[1.3rem] h-[1.3rem] rounded-full text-xs grid place-items-center text-center">
                                            {item.notifications(indentSheet || [])}
                                        </span>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-2 text-center text-sm">
                    Powered by &#8208;{' '}
                    <a className="text-primary" href="https://botivate.in" target="_blank" rel="noopener noreferrer">
                        Botivate
                    </a>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};