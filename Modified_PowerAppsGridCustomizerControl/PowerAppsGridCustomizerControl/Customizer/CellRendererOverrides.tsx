/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { CellRendererOverrides, CellRendererProps, GetRendererParams, RECID } from './types';
import { Icon} from "@fluentui/react/lib/Icon";
import {IInputs} from "../generated/ManifestTypes";
import { Label } from '@fluentui/react/lib/components/Label';

export const generateCellRendererOverrides = (colors : any, context : ComponentFramework.Context<IInputs>) => {
    const cellRendererOverrides: CellRendererOverrides = {
        ["Text"]: (props: CellRendererProps, rendererParams: GetRendererParams) => {
            // TODO: Add your custom cell editor overrides here
            const column = rendererParams.colDefs[rendererParams.columnIndex];
            if(column.name==="address1_city"){
                return <label>Lives in <b>{props.formattedValue}</b></label>;
            }
            return null;
        },
        ["Currency"]: (props, col) => {
            // Only override the cell renderer for the Annual Income column
            if (col.colDefs[col.columnIndex].name === 'annualincome') {
                // Render the cell value in green when the value is blue than $100,000 and red otherwise
                if ((props.value as number) > 100000) {
                    return <Label style={{ color: 'blue' }}>{props.formattedValue}</Label>
                }
                else {
                    return <Label style={{ color: 'red' }}>{props.formattedValue}</Label>
                }
            }
        },
        ["OptionSet"]: (props: CellRendererProps, rendererParams: GetRendererParams) => {     

           const onCellClicked = (event?: React.MouseEvent<HTMLElement, MouseEvent> | MouseEvent) => {
                if(props.startEditing) props.startEditing();
                console.log("onCellClicked----------");
            } 
            return (<div onClick={onCellClicked}>
                <Icon style={{color: colors[props.value as number] ?? "gray", marginRight: "8px"}} iconName="CircleShapeSolid" aria-hidden="true" /> 
                {props.formattedValue}
            </div>)             
        }, 
        ["TwoOptions"]: (props: CellRendererProps, rendererParams: GetRendererParams) => {                 
            const column = rendererParams.colDefs[rendererParams.columnIndex];                         
                
                const onCellClicked = () => {                    
                    if(props.startEditing) props.startEditing(!props.value);                  
                } 
             const smiley = props.value ? "Like" : "Dislike";
              const label = props.formattedValue;
              return <div onClick={onCellClicked} style={{textAlign: "center"}}><Icon iconName={smiley} style={{color: props.value  ? "green" : "red"}}></Icon></div>
        }
       ,
        ["Email"]: (props: CellRendererProps, rendererParams: GetRendererParams) => {     
            const column = rendererParams.colDefs[rendererParams.columnIndex]; 
            
            const openNewEmail = () => {     
                const Id = rendererParams.rowData?.[RECID];
                const fullName = (rendererParams.rowData as any)["fullname"] as string;   
            
                var pageInput = {
                    pageType: "entityrecord",
                    entityName: "email",
                    createFromEntity: {
                        entityType: "contact",
                        id: Id,
                        name: fullName
                    }
                };
                var navigationOptions = {
                    target: 2,
                    height: {value: 80, unit:"%"},
                    width: {value: 70, unit:"%"},
                    position: 1
                };

                // @ts-ignore
                context.navigation.navigateTo(pageInput, navigationOptions);
            }   
            
            const onClickEdit : () => void = () => {
                if(props.startEditing) props.startEditing();
            }

            return <div style={{textAlign: "center"}}><label onClick={onClickEdit}>{props.formattedValue}</label> <Icon iconName="Mail" onClick={openNewEmail} ></Icon></div>;
        }
    }
    return cellRendererOverrides;
}

