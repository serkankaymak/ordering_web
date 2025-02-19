'use client'

import React, { useEffect } from 'react';
import { Box, Checkbox, FormControlLabel, Paper } from '@mui/material';
import "./SitePreferencesDrawer.css";
import { useSitePreferencesContext } from '@/app/providers/global.providers/sitePreferences.provider';
import { useUserContext } from '@/app/providers/global.providers/user.povider';
import { he, tr } from 'date-fns/locale';

interface SitePreferencesComponentProps { }

const SitePreferencesDrawerComponent: React.FC<SitePreferencesComponentProps> = () => {

  const { user } = useUserContext();
  const { sitePreferences, updatePreferences } = useSitePreferencesContext();


  useEffect(() => { }, [])

  if (user == undefined || (user?.isAdmin() || user?.isDeveloper()) == false) return <></>
  if (sitePreferences == null) return <></>

  return (
    <Paper
      style={{ zIndex: 100 }}
      elevation={8}
      sx={{ backgroundColor: "background.paper" }}
    >
      <Box style={{ zIndex: 100 }} >
        <input
          style={{ display: "none" }}
          type="checkbox" id="toggler" />
        <aside className=" flex flex-col 
         fixed top-0 left-0 h-screen w-[250px] z-50 my-shadow font-[cursive]"
        >
          <Paper sx={{ height: '100vh' }}
            className="flex flex-col px-[20px] box-border  ">
            <h1 className=" font-[cursive] text-[35px] relative  mt-8 ">
              <span>Preferences</span>
              <label htmlFor="toggler">
                <i

                  className="fas fa-bars absolute top-[80px] left-[215px] px-[11px] py-[4px] text-center rounded-[8px] cursor-pointer"></i>
              </label>
              <hr></hr>
            </h1>

            <div
              className='
               overflow-y-scroll
               scrollbar-none sm:scrollbar-none scrollbar-track-gray-200 scrollbar-thumb-gray-500
               h-full  mt-8 flex 
               flex-col  justify-between '>

              <Box className="flex flex-col gap-4">
                <FormControlLabel
                  sx={{ "& .MuiTypography-root": { fontSize: 15 }, }}
                  className='text-wrap text-sm'
                  onChange={(e: any) => {
                    const previous = sitePreferences;
                    const updated = sitePreferences?.copy({ useTransitionableProductCard: !previous?.useTransitionableProductCard })
                    updatePreferences(updated!);
                  }}
                  control={<Checkbox checked={sitePreferences?.useTransitionableProductCard ?? false} />}
                  label="Use transitionable product card description"
                />
                <FormControlLabel
                  sx={{ "& .MuiTypography-root": { fontSize: 15 }, }}
                  className='text-wrap text-sm'
                  onChange={(e: any) => {
                    const previous = sitePreferences;
                    const updated = sitePreferences?.copy({ showNameAndPriceOnProductCard: !previous?.showNameAndPriceOnProductCard })
                    updatePreferences(updated!);
                  }}
                  control={<Checkbox checked={sitePreferences?.showNameAndPriceOnProductCard} />}
                  label="Show product name and price on product card"
                />

              </Box>

              <ul className='pl-0 pb-10'>
                <li className="list-none text-[18px] py-[10px] cursor-pointer"><hr></hr></li>
                <li className="list-none text-[18px] py-[10px] cursor-pointer"><i className="fas fa-headset w-[50px]"></i> Get Help</li>
              </ul>

            </div>

          </Paper>
        </aside>
      </Box>
    </Paper>

  );
};

export default SitePreferencesDrawerComponent;
