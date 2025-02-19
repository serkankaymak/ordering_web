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
        <aside className="flex flex-col  ">
          <Paper sx={{ height: '100vh' }}
            className="flex flex-col aside-wrapper   ">
            <h1 className="logo-text mt-8 ">
              <span>Preferences</span>
              <label htmlFor="toggler">
                <i className="fas fa-bars sidebar-toggle"></i>
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
                  control={<Checkbox checked={sitePreferences?.useTransitionableProductCard} />}
                  label="Use Transitionable ProductCard"
                />
              
              </Box>

              <ul>
                <li><hr></hr></li>
                <li><i className="fas fa-headset"></i> Get Help</li>
                <li><i className="fas fa-comment"></i> Chat With Us</li>
              </ul>

            </div>

          </Paper>
        </aside>
      </Box>
    </Paper>

  );
};

export default SitePreferencesDrawerComponent;
