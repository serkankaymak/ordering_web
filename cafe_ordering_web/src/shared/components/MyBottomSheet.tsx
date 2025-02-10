import { Close, DragHandle } from "@mui/icons-material";
import { Box, IconButton, SwipeableDrawer } from "@mui/material";

interface MyBottomSheetProps {
    className?: string | null;
    isOpen: boolean;
    onCloseButtonClicked: () => void;
    drawerBleeding: number;
    children: React.ReactNode;
}

const MyBottomSheet: React.FC<MyBottomSheetProps> = ({ children,
    isOpen, drawerBleeding, onCloseButtonClicked, className }) => {

    return (
        <SwipeableDrawer
            className={className ?? ''}
            anchor="bottom"
            open={isOpen}
            onClose={onCloseButtonClicked}
            onOpen={() => { }}
            swipeAreaWidth={drawerBleeding}
            disableSwipeToOpen={false}
            disableBackdropTransition={true}
            PaperProps={{
                sx: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    padding: 3,
                    maxHeight: "100vh",
                    overflow: "hidden",
                },
            }}
            ModalProps={{
                keepMounted: true,
            }}
        >

            {/* Drag Handle ve Kapatma Butonu */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: 2,
                }}
            >
                {/* Kapatma Butonu */}
                <IconButton
                    onClick={() => { if (onCloseButtonClicked != null) onCloseButtonClicked() }}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                    }}
                >
                    <Close sx={{ fontSize: "1.5rem", }} />
                </IconButton>
                {/* Drag Handle */}
                <DragHandle
                    sx={{
                        fontSize: "2rem",
                        cursor: "grab",
                        marginBottom: 0,
                    }}
                />

            </Box>

            <hr className="mb-2 p-0"></hr>
            <Box className=" p-2 whitespace-nowrap scrollbar-thin    scrollbar-track-gray-200       scrollbar-thumb-gray-500"
                sx={{ overflowY: "auto", flex: 1 }}>
                {children}
            </Box>

        </SwipeableDrawer>
    )
}


export default MyBottomSheet;