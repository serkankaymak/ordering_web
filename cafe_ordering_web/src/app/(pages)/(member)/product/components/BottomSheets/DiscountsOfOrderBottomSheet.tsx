import { useSitePreferencesContext } from "@/app/providers/global.providers/sitePreferences.provider";
import { IComponent } from "@/app/types/ViewTypes";
import { OrderCanHaveDiscountDto } from "@/application/dtos/OrderCanHaveDiscountDto";
import { DiscountModel } from "@/domain/DiscountModels";
import { UserModel } from "@/domain/UserModels";
import MyBottomSheet from "@/shared/components/MyBottomSheet";
import { Box, Card, Checkbox, FormControlLabel, Typography } from "@mui/material";

interface DiscountsOfOrderBottomSheetProps {
    currentUser?: UserModel;
    isOpen: boolean;
    onCloseClicked?: () => void;
    awaibleDiscounts: DiscountModel[];
    awaibleOrderDiscounts: OrderCanHaveDiscountDto[];
}

const DiscountsOfOrderBottomSheet: IComponent<DiscountsOfOrderBottomSheetProps> = ({
    currentUser,
    isOpen, awaibleDiscounts, awaibleOrderDiscounts, onCloseClicked

}) => {
    const { sitePreferences, updatePreferences } = useSitePreferencesContext();
    const drawerBleeding = 0;
    return <><MyBottomSheet className='z-40'
        isOpen={isOpen}
        onCloseButtonClicked={function (): void {
            if (onCloseClicked != null) onCloseClicked();
        }} drawerBleeding={drawerBleeding} >


        {currentUser && currentUser.canChangeSitePreferences() &&

            <Box className="flex flex-col my-5">
                <FormControlLabel
                    sx={{ "& .MuiTypography-root": { fontSize: 15 }, }}
                    className='text-wrap text-sm'
                    onChange={(e: any) => {
                        const previous = sitePreferences;
                        const updated = sitePreferences?.copy({ showClientAwaibleDiscounts: !previous?.showClientAwaibleDiscounts })
                        updatePreferences(updated!);
                    }}
                    control={<Checkbox checked={sitePreferences?.showClientAwaibleDiscounts} />}
                    label="showClient Awaible Discounts"
                />

                <FormControlLabel
                    sx={{ "& .MuiTypography-root": { fontSize: 15 }, }}
                    className='text-wrap text-sm'
                    onChange={(e: any) => {
                        const previous = sitePreferences;
                        const updated = sitePreferences?.copy({ showClientDetailedAwaibleDiscounts: !previous?.showClientDetailedAwaibleDiscounts })
                        updatePreferences(updated!);
                    }}
                    control={<Checkbox checked={sitePreferences?.showClientDetailedAwaibleDiscounts} />}
                    label="showClient Detailed Awaible Discounts"
                />

            </Box>
        }






        <Box className="flex flex-col overflow-hidden gap-3 gap-y-10">

            {sitePreferences?.showClientAwaibleDiscounts && <>
                {awaibleDiscounts && awaibleDiscounts.length > 0 && (
                    <Box className="mx-2">
                        <Typography className="text-center " variant="h6" fontWeight="bold" mb={2}>
                            Available Discounts
                        </Typography>
                        <Box className="flex flex-row justify-center gap-3">
                            {awaibleDiscounts.map((discount, index) => (
                                <Card key={index} className="p-3 border rounded-lg shadow-sm">
                                    <Typography variant="body1" fontWeight="medium">
                                        {discount.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Discount Percentage: {discount.discountPercentage}%
                                    </Typography>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                )}

            </>}


            {sitePreferences?.showClientDetailedAwaibleDiscounts && <>

                {awaibleOrderDiscounts != null && awaibleOrderDiscounts.length !== 0 && (
                    <Box className="mx-2">
                        <Typography className="text-center" variant="h6" fontWeight="bold" mb={2}>
                            Detailed Discounts
                        </Typography>
                        <Box className="flex flex-row flex-wrap justify-center" gap={2}>
                            {awaibleOrderDiscounts.map((orderHasDiscount, index) => (
                                <Box key={index} p={2} border={1} borderColor="divider" borderRadius={2}>
                                    <Typography variant="body1" fontWeight="medium">
                                        {orderHasDiscount.discount.name}
                                    </Typography>
                                    <hr></hr>
                                    <Typography variant="body2">
                                        Discount Percentage: {orderHasDiscount.discount.discountPercentage}%
                                    </Typography>
                                    <Typography variant="body2">
                                        End Date: {new Date(orderHasDiscount.discount.endDateUtc!).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Discount Amount: {orderHasDiscount.discountAmount}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        Order Price : {orderHasDiscount.order.price}
                                    </Typography>
                                    <Typography variant="body2">
                                        Net Total Price: {orderHasDiscount.netTotalPrice}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </>}



        </Box>
    </MyBottomSheet></>
};

export default DiscountsOfOrderBottomSheet;