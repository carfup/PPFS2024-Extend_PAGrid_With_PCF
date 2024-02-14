import { Icon } from '@fluentui/react/lib/components/Icon';
import * as React from 'react';
import { ColorfulDropDown } from '../Controls/ColorfulDropDown';
import { CellEditorOverrides, CellEditorProps, GetEditorParams } from './types';
import { TextField } from '@fluentui/react/lib/components/TextField';

export const generateCellEditorOverrides = (colors : any)=>{
  const cellEditorOverrides: CellEditorOverrides = {
    ["Text"]: (defaultProps: CellEditorProps, rendererParams: GetEditorParams) => {
      // TODO: Add your custom cell editor overrides here
      return null
    },
    ["OptionSet"]: (defaultProps: CellEditorProps, rendererParams: GetEditorParams) => {
      console.log("Editor optionset", rendererParams.rowData);
      const defaultValue = defaultProps.value as number;
    
      const cell = rendererParams.colDefs[rendererParams.columnIndex];
  
      const options =  (cell as any).customizerParams.dropDownOptions.map((option:any) => { 
        return {
          ...option, data: {color: colors[option.key]}
          }
        });

      const onChange=(value: number | null) =>{
        rendererParams.onCellValueChanged(value);              
      }
  
      return <ColorfulDropDown defaultValue={defaultValue} options = {options} onChange={onChange}/>
    
    }, 
    ["TwoOptions"]: (defaultProps: CellEditorProps, rendererParams: GetEditorParams) => {     
      const column = rendererParams.colDefs[rendererParams.columnIndex];             

        console.log("Editor boolean", rendererParams.rowData);    
        const value  = defaultProps.value == true;      
        rendererParams.onCellValueChanged(value); //autochange value on click
        const smiley = value ? "Like" : "Dislike";
        const label = value ? (column as any).customizerParams.labels.onText : (column as any).customizerParams.labels.offText;
        const onChange=() =>{          
          rendererParams.onCellValueChanged(!value);      
          rendererParams.stopEditing(false); //no rerender without this.
        }
        return <div onClick={onChange} style={{textAlign: "center"}}><Icon iconName={smiley} style={{color: value === true ? "green" : "red"}}></Icon></div>
      
    },
    ["Phone"]: (defaultProps: CellEditorProps, rendererParams: GetEditorParams) => {     
      const column = rendererParams.colDefs[rendererParams.columnIndex]; 
      var defaultValue = defaultProps.value as string;

      if(column.name==="telephone1"){
        const onChange=(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) : void => {         
          rendererParams.onCellValueChanged(newValue!); 
        }        
        return <TextField iconProps={{iconName : "Phone"}} defaultValue={defaultValue} onChange={onChange}/>
      }

      return null;
    },
    ["Email"]: (defaultProps: CellEditorProps, rendererParams: GetEditorParams) => {     
      const column = rendererParams.colDefs[rendererParams.columnIndex]; 
      const defaultValue = defaultProps.value as string;

      const onChange=(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) : void => {         
        rendererParams.onCellValueChanged(newValue);      
      }        
      return <TextField iconProps={{iconName : "Email"}} defaultValue={defaultValue} onChange={onChange}/>
      
    }
  }

  return cellEditorOverrides;
}


