import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
        theme.palette.type === "light"
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
            },
    title: {
        flex: "1 1 100%"
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { selectObject, removeItem } = props;
    const items = [...selectObject.getSelectKey()];
    
    const deleteItem = () => {
        items.forEach((item) => {
            removeItem(item);
            selectObject.cancelSelected(item);
        })
    }

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: selectObject.getNumSelected() > 0
            })}
        >
            {selectObject.getNumSelected() > 0 ? (
                <Typography
                    className={classes.title}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {selectObject.getNumSelected()} selected
                </Typography>
            ) : (
                    <Typography
                        className={classes.title}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                        align="center"
                        color="primary"
                    >
                        項目表
                    </Typography>
                )}

            {selectObject.getNumSelected() > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={deleteItem} >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
        </Toolbar>
    );
};

/*
EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};
*/

const tableStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        height: '100%'
    },
    table: {
        //width: "100%"
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1
    },
    root: {
        display: "flex",
        flexDirection: "column",
        height: '100%'
    },
}));

const SelectedMapHook = () => {
    const [selected, setSelected] = React.useState(new Map());
    const getSelectKey = ()=> selected.keys();
    const hasSelected = name => selected.has(name);
    const cancelSelected = (name) => {
        if (selected.delete(name)) setSelected(new Map(selected));
    }
    const isSelected = (name) => selected.has(name);
    const addSelect = name => setSelected(new Map(selected.set(name)));
    const getNumSelected = () => selected.size;
    const selectObject = { getSelectKey, cancelSelected, addSelect, isSelected, hasSelected, getNumSelected }
    return selectObject;
}

export default function ListGroup(props) {

    const { itemsMap, removeItem,TestComponent } = props;
    const itemsList = [...itemsMap.values()];
    const classes = tableStyles();
    const [dense, setDense] = React.useState(false);
    const selectObject = SelectedMapHook();

    const handleClick = (event, name) => {
        selectObject.hasSelected(name) ? selectObject.cancelSelected(name) : selectObject.addSelect(name);
    }

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    return (
        <div className={classes.root} >
           <TestComponent />
            <EnhancedTableToolbar selectObject={selectObject} removeItem={removeItem} />
            <TableContainer className={classes.container}>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                    aria-label="enhanced table"
                >
                    <TableBody>
                        {itemsList.map((row, index) => {
                            const isItemSelected = selectObject.isSelected(row.refno);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleClick(event, row.refno)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.refno + row.type}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isItemSelected}
                                            inputProps={{ "aria-labelledby": labelId }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                        multiline="true"
                                    >
                                        {`${row.refno} ${row.desc} ${row.dbRefNo}`}
                                    </TableCell>
                                    <TableCell align="right">{row.type}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export const TestComponent = () => {
    const testString = 'testComponent';
    return (
        <div>
            {testString};
        </div>
    )
}