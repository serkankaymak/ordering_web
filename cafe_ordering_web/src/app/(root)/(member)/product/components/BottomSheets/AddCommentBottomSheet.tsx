import React, { useState } from 'react';
import { Box, Button, SwipeableDrawer, Typography, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MyRichEditor from '@/shared/components/MyRichTextEditor';
import { Close, DragHandle } from '@mui/icons-material';
import MyBottomSheet from '@/shared/components/MyBottomSheet';
import { IComponent } from '@/app/types/ViewTypes';


interface AddOrUpdateCommentBottomSheetProps {
    isOpen: boolean;
    performOnCloseClicked: () => void;
    onSaved: (comment: string) => void;
}

const AddOrUpdateCommentBottomSheet: IComponent<AddOrUpdateCommentBottomSheetProps> = ({
    isOpen, performOnCloseClicked, onSaved }) => {
    const [comment, setComment] = useState('');
    const theme = useTheme();
    //Bu ayar, sayfanın alt kısmındaki öğelere tıklarken, tıklama işleminin kaydırma hareketi olarak algılanmasını önlemeye yardımcı olacaktır.
    const drawerBleeding = 0; // Alt tabakanın her zaman görünür olacak kısmının yüksekliği

    const handleSave = () => {
        onSaved(comment);
        setComment(''); // Clear the comment after saving
        performOnCloseClicked(); // Close the bottom sheet
    };


    return (
        <MyBottomSheet className='z-50'
            isOpen={isOpen}
            onCloseButtonClicked={function (): void {
                performOnCloseClicked();
            }}
            drawerBleeding={drawerBleeding}
        >
            <MyRichEditor
                value={comment}
                onChange={setComment}
                placeholder="Write your comment here..."
                performOnSave={handleSave}
            />

        </MyBottomSheet>
    );
};

export default AddOrUpdateCommentBottomSheet;
