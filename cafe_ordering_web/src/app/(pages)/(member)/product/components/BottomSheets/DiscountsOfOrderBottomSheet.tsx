import { IComponent } from "@/app/types/ViewTypes";
import { DiscountModel } from "@/domain/DiscountModels";
import MyBottomSheet from "@/shared/components/MyBottomSheet";
import { Box, Card, Typography } from "@mui/material";

interface DiscountsOfOrderBottomSheetProps {
    isOpen: boolean;
    onCloseClicked?: () => void;
    awaibleDiscounts: DiscountModel[];
}

const DiscountsOfOrderBottomSheet: IComponent<DiscountsOfOrderBottomSheetProps> = ({
    isOpen, awaibleDiscounts, onCloseClicked

}) => {
    const drawerBleeding = 0;

    return <><MyBottomSheet className='z-40'
        isOpen={isOpen}
        onCloseButtonClicked={function (): void {
            if (onCloseClicked != null) onCloseClicked();
        }} drawerBleeding={drawerBleeding} >

        <Box className="flex flex-col overflow-hidden p-1">

            {awaibleDiscounts != null && awaibleDiscounts.length != 0 &&
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        Awaible Discounts
                    </Typography>
                    <Box className="flex flex-col">
                        {awaibleDiscounts && awaibleDiscounts.map((discount, index) =>
                            <Box key={index}>
                                {true && <Card className="flex flex-col gap-2 border" key={index}>
                                    <span> {discount.name}</span>
                                    <span> indirim yüzdesi :  {discount.discountPercentage}</span>
                                </Card>}

                            </Box>
                        )}
                    </Box>
                </Box>
            }
        </Box>

    </MyBottomSheet></>

};

export default DiscountsOfOrderBottomSheet;