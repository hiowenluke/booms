
const servers = {
    "s1": {
        "host": "localhost",
        "port": 50051
    },
    "s2": {
        "host": "localhost",
        "port": 50052
    },
    "config": {
        "host": "localhost",
        "port": 50054
    },
    "core": {
        "host": "localhost",
        "port": 50056
    },
    "jobs": {
        "host": "localhost",
        "port": 50055
    }
};

const apis = {
    "s1": {
        "about": {},
        "say": {
            "hi": {}
        }
    },
    "s2": {
        "about": {}
    },
    "config": {
        "get": {}
    },
    "core": {
        "__db": {
            "table": {
                "getTableId": {},
                "getTableIdByName": {},
                "getTableNameById": {}
            },
            "tree": {
                "getAllTrees": {},
                "getTree": {},
                "getTreeReverse": {},
                "getTreeWithPathInfo": {}
            },
            "getTableId": {},
            "getTableIdByName": {},
            "getTableNameById": {},
            "getAllTrees": {},
            "getTree": {},
            "getTreeReverse": {},
            "getTreeWithPathInfo": {}
        },
        "__lib": {
            "splitStringToArray": {}
        },
        "define": {
            "field": {
                "addFields": {},
                "cloneFields": {},
                "deleteFields": {},
                "getAllFields": {},
                "getFieldTypeByName": {},
                "getNotNullableFieldNames": {},
                "getReadOnlyFieldNames": {},
                "getUniqueFieldNames": {},
                "isFieldExists": {},
                "renameField": {},
                "renameFieldsLike": {},
                "updateField": {},
                "updateFields": {}
            },
            "module": {
                "addModule": {},
                "getModuleIdByName": {},
                "getModuleNameById": {},
                "getSubModules": {}
            },
            "table": {
                "addTable": {},
                "cloneTable": {},
                "deleteTable": {},
                "deleteTables": {},
                "getAllTableNames": {},
                "getAllTablesInfo": {},
                "getTableIdByName": {},
                "getTableInfoById": {},
                "getTableInfoByName": {},
                "getTableNameById": {},
                "isTableNameExists": {}
            },
            "tools": {
                "tableNameToId": {}
            },
            "addFields": {},
            "cloneFields": {},
            "deleteFields": {},
            "getAllFields": {},
            "getFieldTypeByName": {},
            "getNotNullableFieldNames": {},
            "getReadOnlyFieldNames": {},
            "getUniqueFieldNames": {},
            "isFieldExists": {},
            "renameField": {},
            "renameFieldsLike": {},
            "updateField": {},
            "updateFields": {},
            "addModule": {},
            "getModuleIdByName": {},
            "getModuleNameById": {},
            "getSubModules": {},
            "addTable": {},
            "cloneTable": {},
            "deleteTable": {},
            "deleteTables": {},
            "getAllTableNames": {},
            "getAllTablesInfo": {},
            "getTableIdByName": {},
            "getTableInfoById": {},
            "getTableInfoByName": {},
            "getTableNameById": {},
            "isTableNameExists": {},
            "tableNameToId": {}
        },
        "index": {},
        "mido": {
            "attachMidNameToData": {},
            "check": {},
            "convertWhereMid": {},
            "genMidInfo": {},
            "getMainTableName": {},
            "getMidName": {},
            "toMidName": {}
        },
        "source": {
            "field": {
                "addFields": {},
                "deleteFields": {},
                "updateFields": {}
            },
            "table": {
                "buildTableStructure": {},
                "buildTablesStructure": {},
                "deleteTable": {},
                "deleteTables": {},
                "isTableExists": {}
            },
            "tools": {
                "getSourceIdByName": {},
                "getSourceIdFromQuery": {},
                "getSourceNameById": {},
                "getSourceRows": {},
                "getSourceValue": {},
                "isSourceValueExists": {}
            },
            "addFields": {},
            "deleteFields": {},
            "updateFields": {},
            "buildTableStructure": {},
            "buildTablesStructure": {},
            "deleteTable": {},
            "deleteTables": {},
            "isTableExists": {},
            "getSourceIdByName": {},
            "getSourceIdFromQuery": {},
            "getSourceNameById": {},
            "getSourceRows": {},
            "getSourceValue": {},
            "isSourceValueExists": {}
        },
        "system": {
            "convertFieldInfoToDbDefinition": {},
            "convertFieldInfosToDbDefinitions": {},
            "fieldAttributes": {
                "init": {},
                "getAll": {},
                "getBy": {}
            },
            "fieldTypes": {
                "init": {},
                "getAll": {},
                "getBy": {},
                "isNumericType": {},
                "isTextType": {}
            },
            "tableTypes": {
                "init": {},
                "getAll": {}
            }
        },
        "utils": {
            "initTable": {},
            "initTables": {}
        }
    },
    "jobs": {
        "app": {
            "database": {
                "create": {},
                "delete": {},
                "isExists": {},
                "rename": {}
            }
        },
        "server": {
            "create": {}
        }
    }
};

module.exports = {servers, apis};
