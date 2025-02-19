import { DiscountModel, DiscountItemModel, DiscountType } from '@/domain/DiscountModels';
import { Box, Button, FormControl, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import React from 'react';
import DiscountItemComponent from './components/DiscountItemComponent';
import { Update, Delete, Add, Remove, Save } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MyDatePicker, MyDateTimePicker } from '@/shared/components/MyDatePicker';


interface DiscountSpecialtBasedComponentProps {
    discount: DiscountModel;
    showUpdateActions?: boolean;
    onUpdateClicked?: (discountId: number) => void;
    onDeleteClicked?: (discountId: number) => void;
    onSaveClicked?: () => void;
    onAnyPropertyChanged?: (key: keyof DiscountModel, value: any) => void;
}

const DiscountSpecialBasedComponent: React.FC<DiscountSpecialtBasedComponentProps> = ({
    discount,
    showUpdateActions = true,
    onUpdateClicked, onDeleteClicked,
    onSaveClicked, onAnyPropertyChanged
}) => {

    return (
        <TableContainer sx={{ padding: 1 }} className="border my-1" component={Paper}>
            <Table padding='none' sx={{ "& td, & th": { borderBottom: "none" } }} size="small">
                <TableBody>


                    <TableRow className=''>
                        <TableCell>
                            <Box className='flex flex-col'>
                                {!showUpdateActions && <h5 className='uppercase'  >  {discount.name}</h5>}
                                {showUpdateActions && <FormControl>
                                    <TextField
                                        value={discount.name}
                                        onChange={(e: any) => { onAnyPropertyChanged && onAnyPropertyChanged("name", e.target.value!) }}
                                        label={"discountName"}></TextField>
                                </FormControl>}
                            </Box>
                        </TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell>

                            <Box className="flex w-full">
                                <Box className="flex flex-col">
                                    <div>  indirimOranı :   {discount.discountPercentage}</div>
                                    <div>  kaçKezUygulanabilir :   {discount.maxApplicableTimes}</div>
                                    <div>    Sona Erme Tarihi :   {discount.endDateUtc ? discount.getLocaleDate()?.toLocaleString() : ""}</div>
                                </Box>
                            </Box>

                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell sx={{ padding: 1 }}>
                            {
                                showUpdateActions &&
                                <Box className="flex  mt-4 justify-between  w-full">

                                    <FormControl>
                                        <TextField
                                            onChange={(e) => {
                                                onAnyPropertyChanged
                                                    && onAnyPropertyChanged("discountPercentage", e.target.value!)
                                            }}
                                            type='number'
                                            fullWidth variant="outlined" size="small"
                                            label={"Percentage"}
                                            sx={{ width: 100 }}
                                            value={discount.discountPercentage ?? ''} >
                                        </TextField>
                                    </FormControl>



                                    <Box className="flex items-center  justify-end w-full">
                                        <IconButton
                                            onClick={(e) => {
                                                onAnyPropertyChanged &&
                                                    onAnyPropertyChanged("maxApplicableTimes", (discount.maxApplicableTimes - 1))
                                            }}
                                            sx={{ padding: 0 }} size='small'><Remove />
                                        </IconButton>
                                        <IconButton
                                            disabled={true} size='small'  >{discount.maxApplicableTimes}
                                        </IconButton>
                                        <IconButton
                                            onClick={(e) => {
                                                onAnyPropertyChanged &&
                                                    onAnyPropertyChanged("maxApplicableTimes", (discount.maxApplicableTimes + 1))
                                            }}
                                            sx={{ padding: 0 }} size='small'><Add />
                                        </IconButton>

                                    </Box>



                                </Box>
                            }
                        </TableCell>
                    </TableRow>


                    {showUpdateActions &&
                        <TableRow>
                            <TableCell sx={{ padding: 1 }}>
                                <MyDateTimePicker
                                    valueAsUtc={discount.getLocaleDate() ?? new Date()}
                                    onValueChanged={(date) => {
                                        console.log(date?.toUTCString())
                                        onAnyPropertyChanged &&
                                            onAnyPropertyChanged("endDateUtc", date!.toUTCString())
                                    }}
                                    slotProps={{ textField: { variant: "outlined", fullWidth: true } }}
                                    label={'İndirimBitişTarihi'} />
                            </TableCell>
                        </TableRow>
                    }







                    {/** special ın discount item ı olmaz  */}
                    {false && <TableRow>
                        <TableCell>
                            {discount.discountItems.map((d, i) =>
                                <DiscountItemComponent
                                    showActions={false} key={i} discountItem={d}></DiscountItemComponent>
                            )}
                        </TableCell>
                    </TableRow>}

                    {
                        !showUpdateActions && <TableRow>
                            <TableCell>
                                <Box className="text-xs" sx={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
                                    <IconButton onClick={() => { onUpdateClicked && onUpdateClicked(discount.id) }}>
                                        <Update />
                                    </IconButton>
                                    <IconButton onClick={() => { onDeleteClicked && onDeleteClicked(discount.id) }}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    }

                    {showUpdateActions && < TableRow >
                        <TableCell align='right' sx={{ padding: 1 }}>
                            <Button variant='outlined' color='secondary'
                                onClick={(e: any) => {
                                    onSaveClicked && onSaveClicked();
                                }}
                                startIcon={<Save />}>Save</Button>
                        </TableCell>
                    </TableRow>}
                </TableBody>
            </Table>

        </TableContainer >
    );
};

export default React.memo(DiscountSpecialBasedComponent);
