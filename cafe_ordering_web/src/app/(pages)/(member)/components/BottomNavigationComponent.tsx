import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Badge, Menu, Paper, Button } from '@mui/material';
import { Home, Search, Person, ShoppingCart, ContactMail, Info, MenuBook, TextSnippet } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { IComponent } from '@/app/types/ViewTypes';


interface BottomNavigationComponentProps {
  className?: string;
}

const BottomNavigationComponent: IComponent<BottomNavigationComponentProps> = ({ className }) => {
  const router = useRouter();
  //const { orderedProducts } = useProductContext();

  return (
    <Box className={`${className || ''}`}>

      <BottomNavigation className=''>
        <BottomNavigationAction label="Test" value="/test" icon={<TextSnippet />} />
        <BottomNavigationAction label="Home" value="/" icon={<Home />} />
        <BottomNavigationAction label="Contact" value="/contact" icon={<ContactMail />} />
        <BottomNavigationAction onClick={() => router.push("/product")} label="Profile" icon={
          //   <Badge badgeContent={ArrayListStream.fromList(orderedProducts).sum(x => x?.quantity!)} color="secondary">
          //   </Badge>
          <ShoppingCart />
        } />
      </BottomNavigation>
    </Box>
  );
};




export default React.memo(BottomNavigationComponent);
