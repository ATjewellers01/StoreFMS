import Heading from '../element/Heading';

import { useEffect, useState } from 'react';
import { useSheets } from '@/context/SheetsContext';
import type { ColumnDef } from '@tanstack/react-table';
import { Pill } from '../ui/pill';
import { Store, Search, PlusCircle, Pencil } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '../ui/select';
import DataTable from '../element/DataTable';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { postToSheet } from '@/lib/fetchers';
import { toast } from 'sonner';

interface InventoryTable {
    rowIndex: number;
    itemName: string;
    groupHead: string;
    uom: string;
    status: string;
    opening: number;
    maxLevel: number;
    rate: number;
    indented: number;
    approved: number;
    purchaseQuantity: number;
    outQuantity: number;
    current: number;
    totalPrice: number;
}

const schema = z.object({
    groupHead: z.string().min(1, 'Group Head is required'),
    itemName: z.string().min(1, 'Item Name is required'),
    uom: z.string().min(1, 'UOM is required'),
    maxLevel: z.coerce.number({ invalid_type_error: 'Max Level must be a number' }).optional(),
    opening: z.coerce.number({ invalid_type_error: 'Opening must be a number' }),
    individualRate: z.coerce.number({ invalid_type_error: 'Individual Rate must be a number' }).optional(),
});

type InventoryFormValues = z.infer<typeof schema>;

export default () => {
    const { inventorySheet, inventoryLoading, updateAll, masterSheet: options } = useSheets();

    const [tableData, setTableData] = useState<InventoryTable[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchItemName, setSearchItemName] = useState('');
    const [editItem, setEditItem] = useState<InventoryTable | null>(null);

    const form = useForm<InventoryFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            groupHead: '',
            itemName: '',
            uom: '',
            maxLevel: undefined,
            opening: undefined,
            individualRate: undefined,
        },
    });


    // Build flat list of all items with their group head mapping
    const allItems: { item: string; group: string }[] = Object.entries(options?.groupHeads || {}).flatMap(
        ([group, items]) => items.map((item) => ({ item, group }))
    );

    useEffect(() => {
        setTableData(
            inventorySheet.filter((i) => i.itemName && i.itemName.trim() !== '').map((i) => ({
                rowIndex: i.rowIndex,
                totalPrice: i.totalPrice,
                uom: i.uom,
                rate: i.individualRate,
                current: i.current,
                status: i.colorCode,
                indented: i.indented,
                opening: i.opening,
                maxLevel: i.maxLevel,
                itemName: i.itemName,
                groupHead: i.groupHead,
                purchaseQuantity: i.purchaseQuantity,
                approved: i.approved,
                outQuantity: i.outQuantity,
            }))
        );
    }, [inventorySheet]);

    async function onSubmit(values: InventoryFormValues) {
        try {
            setLoading(true);
            const row = {
                ...(editItem ? { rowIndex: editItem.rowIndex } : {}),
                groupHead: values.groupHead,
                itemName: values.itemName,
                uom: values.uom,
                maxLevel: values.maxLevel,
                opening: values.opening,
                individualRate: values.individualRate,
            };

            const action = editItem ? 'update' : 'insert';
            await postToSheet([row] as any, action, 'INVENTORY');
            toast.success(editItem ? 'Inventory item updated successfully' : 'Inventory item added successfully');
            setOpenDialog(false);
            setEditItem(null);
            form.reset();
            setSearchItemName('');
            setTimeout(() => updateAll(), 1000);
        } catch (error) {
            console.error(error);
            toast.error(editItem ? 'Failed to update inventory item' : 'Failed to add inventory item');
        } finally {
            setLoading(false);
        }
    }

    function onError() {
        toast.error('Please fill all required fields');
    }

    const columns: ColumnDef<InventoryTable>[] = [
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const data = row.original;
                            setEditItem(data);
                            form.reset({
                                itemName: data.itemName,
                                groupHead: data.groupHead,
                                uom: data.uom,
                                maxLevel: data.maxLevel,
                                opening: data.opening,
                                individualRate: data.rate,
                            });
                            setOpenDialog(true);
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'itemName',
            header: 'Item Name',
            cell: ({ row }) => {
                return (
                    <div className="text-wrap max-w-40 text-center">{row.original.itemName}</div>
                );
            },
        },
        { accessorKey: 'groupHead', header: 'Group Head' },
        { accessorKey: 'uom', header: 'UOM' },
        { accessorKey: 'maxLevel', header: 'Max Level' },
        { accessorKey: 'opening', header: 'Opening' },
        {
            accessorKey: 'rate',
            header: 'Individual Rate',
            cell: ({ row }) => {
                return <>&#8377;{row.original.rate}</>;
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const code = row.original.status.toLowerCase();
                if (row.original.current === 0) {
                    return <Pill variant="reject">Out of Stock</Pill>;
                }
                if (code === 'red') {
                    return <Pill variant="pending">Low Stock</Pill>;
                }
                if (code === 'purple') {
                    return <Pill variant="primary">Excess</Pill>;
                }
                return <Pill variant="secondary">In Stock</Pill>;
            },
        },
        { accessorKey: 'indented', header: 'Indented' },
        { accessorKey: 'approved', header: 'Approved' },
        { accessorKey: 'purchaseQuantity', header: 'Purchase Quantity' },
        { accessorKey: 'outQuantity', header: 'Out Quantity' },
        { accessorKey: 'current', header: 'Current Stock' },
        {
            accessorKey: 'totalPrice',
            header: 'Total Price',

            cell: ({ row }) => {
                return <>&#8377;{row.original.totalPrice}</>;
            },
        },
    ];

    return (
        <div>
            <Heading heading="Inventory" subtext="View inveontory">
                <Store size={50} className="text-primary" />
            </Heading>

            <Dialog open={openDialog} onOpenChange={(v) => { 
                setOpenDialog(v); 
                if (!v) {
                    form.reset();
                    setEditItem(null);
                }
            }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editItem ? 'Edit Inventory' : 'Add Inventory'}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {!editItem && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="itemName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Item Name</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(val) => {
                                                                field.onChange(val);
                                                                // Auto-fill group head
                                                                const match = allItems.find((x) => x.item === val);
                                                                if (match) form.setValue('groupHead', match.group);
                                                            }}
                                                            value={field.value}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Item Name" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <div className="flex items-center border-b px-3 pb-3">
                                                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                                                    <input
                                                                        placeholder="Search items..."
                                                                        value={searchItemName}
                                                                        onChange={(e) => setSearchItemName(e.target.value)}
                                                                        onKeyDown={(e) => e.stopPropagation()}
                                                                        className="flex h-10 w-full rounded-md border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                                                                    />
                                                                </div>
                                                                {allItems
                                                                    .filter((x) =>
                                                                        x.item.toLowerCase().includes(searchItemName.toLowerCase())
                                                                    )
                                                                    .map((x, i) => (
                                                                        <SelectItem key={i} value={x.item}>{x.item}</SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="groupHead"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Group Head</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Group Head"
                                                            {...field}
                                                            readOnly
                                                            className="bg-muted cursor-not-allowed"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
                                <FormField
                                    control={form.control}
                                    name="uom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>UOM</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select UOM" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {options?.uoms?.map((uom, i) => (
                                                            <SelectItem key={i} value={uom}>{uom}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maxLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Max Level</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Enter max level" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="opening"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Opening</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Enter opening stock" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="individualRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Individual Rate</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Enter rate" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="pt-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <DataTable
                data={tableData}
                columns={columns}
                dataLoading={inventoryLoading}
                searchFields={['itemName', 'groupHead', 'uom', 'status']}
                className="h-[80dvh]"
                extraActions={
                    <Button
                        variant="default"
                        onClick={() => {
                            setEditItem(null);
                            form.reset({
                                groupHead: '',
                                itemName: '',
                                uom: '',
                                maxLevel: undefined,
                                opening: undefined,
                                individualRate: undefined,
                            });
                            setSearchItemName('');
                            setOpenDialog(true);
                        }}
                        className="flex items-center gap-2"
                    >
                        <PlusCircle size={16} />
                        Add Inventory
                    </Button>
                }
            />
        </div>
    );
};
