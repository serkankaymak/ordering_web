"use client"; // Next.js client component olarak işaretle

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function MiddleDialog() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-center h-screen">
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open Middle Dialog
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm" // Dialog genişliği küçük (sm) olacak
        PaperProps={{
          style: {
            borderRadius: "16px", // Dialog'un kenarlarını yuvarlatıyoruz
            margin: "0", // Boşlukları kaldırıyoruz
          },
        }}
      >
        <DialogTitle>Middle Dialog Title</DialogTitle>
        <DialogContent>
          <p>This is a middle dialog example.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
