
var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var empDBName = "Emp-DB";
var empRelationName = "EmpData";
var connToken = "90938032|-31949274829065566|90949622";
$("#empId").focus();
setBaseUrl(jpdbBaseUrl);

function disableGrp1(ctrl) {
    $("#new").prop('disabled', ctrl);
    $("#save").prop('disabled', ctrl);
    $("#edit").prop('disabled', ctrl);
    $("#change").prop('disabled', ctrl);
    $("#reset").prop('disabled', ctrl);
}

function disableGrp2(ctrl) {
    $("#first").prop('disabled', ctrl);
    $("#prev").prop('disabled', ctrl);
    $("#next").prop('disabled', ctrl);
    $("#last").prop('disabled', ctrl);
}

function disableForm(ctrl) {
    $("#empId").prop('disabled', ctrl);
    $("#empName").prop('disabled', ctrl);
    $("#empSalary").prop('disabled', ctrl);
    $("#empHRA").prop('disabled', ctrl);
    $("#empDA").prop('disabled', ctrl);
    $("#empDeduction").prop('disabled', ctrl);

}

function initEmpForm() {
    localStorage.removeItem("first_rec_no");
    localStorage.removeItem("last_rec_no");
    localStorage.removeItem("rec_no");

}

function setCurrRecNo2LS(jsonObj){
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem('rec_no',data.rec_no);
}

function getCurrRecNoFromLS(){
    return localStorage.getItem('rec_no');
}

function setFirstRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    if (data.rec_no === undefined) {
        localStorage.setItem("first_rec_no", "0");
    } else {
        localStorage.setItem("first_rec_no", data.rec_no);
    }
}

function getFirstRecNoFromLS() {
    return localStorage.getItem("first_rec_no");
}

function setLastRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    if (data.rec_no === undefined) {
        localStorage.setItem("last_rec_no", "0");
    } else {
        localStorage.setItem("last_rec_no", data.rec_no);
    }
}

function getLastRecNoFromLS() {
    return localStorage.getItem("last_rec_no");
}

function getFirst() {

    var getFirstRequest = createFIRST_RECORDRequest(connToken, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getFirstRequest, jpdbIRL);
    showData(result);
    setFirstRecNo2LS(result);
    jQuery.ajaxSetup({async: true});

    $('#empId').prop("disabled", true);
    $('#first').prop("disabled", true);
    $('#prev').prop("disabled", true);
    $('#next').prop("disabled", false);
    $("#save").prop('disabled', true);

}

function getLast() {

    var getLastRequest = createLAST_RECORDRequest(connToken, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getLastRequest, jpdbIRL);
    showData(result);
    setLastRecNo2LS(result);
    jQuery.ajaxSetup({async: true});

    $('#last').prop("disabled", true);
    $('#first').prop("disabled", false);
    $('#prev').prop("disabled", false);
    $('#next').prop("disabled", true);
    $("#save").prop('disabled', true);

}

function getPrev() {
    var r = getCurrRecNoFromLS();
    if (r === 1) {
        $('#first').prop("disabled", true);
        $('#prev').prop("disabled", true);
    }
    
    var getPrevReq = createPREV_RECORDRequest(connToken,empDBName,empRelationName,r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getPrevReq, jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({async: true});
    var r = getCurrRecNoFromLS();
    if (r === 1) {
        $('#first').prop("disabled", true);
        $('#prev').prop("disabled", true);
    }
    $('#save').prop("disabled", true);
}

function getNext(){
//    alert("next");
    var r = getCurrRecNoFromLS();
//    alert(r);
    var getNextReq = createNEXT_RECORDRequest(connToken,empDBName,empRelationName,r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getNextReq, jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({async: true});
    $('#save').prop("disabled", true);
}

getNext();

function newEmp() {
    makeDataFormEmpty();
    disableForm(false);
    $("#empId").focus();
    disableGrp1(true);
    disableGrp2(true);
    $("#save").prop('disabled', false);
    $("#reset").prop('disabled', false);

}

function makeDataFormEmpty() {
    $("#empId").val("");
    $("#empName").val("");
    $("#empSalary").val("");
    $("#empHRA").val("");
    $("#empDA").val("");
    $("#empDeduction").val("");
}

function validateData() {
//    alert("called valid");

    var empId, empName, sal, hra, da, ded;
    empId = $("#empId").val();
    empName = $("#empName").val();
    sal = $("#empSalary").val();
    hra = $("#empHRA").val();
    da = $("#empDA").val();
    ded = $("#empDeduction").val();

    if (empId === "") {
        alert("Employee ID Required Value");
        $("#empId").focus();
        return "";
    }
    if (empName === "") {
        alert("Employee Name is Required Value");
        $("#empName").focus();
        return "";
    }
    if (sal === "") {
        alert("Employee Salary is Required Value");
        $("#empSalary").focus();
        return "";
    }

    if (hra === "") {
        alert("HRA is Required Value");
        $("#empHRA").focus();
        return "";
    }
    if (da === "") {
        alert("DA is Required Value");
        $("#empDA").focus();
        return "";
    }
    if (ded === "") {
        alert("Deduction is Required Value");
        $("#empDeduction").focus();
        return "";
    }
    var jsonStrObj = {
        id: empId,
        name: empName,
        salary: sal,
        hra: hra,
        da: da,
        deduction: ded
    };
    return JSON.stringify(jsonStrObj);
}

function editEmp() {
    disableForm(false);
    $('#empId').prop('disabled', true);
    $('#empName').focus();
    disableGrp1(true);
    disableGrp2(true);
    $('#change').prop('disabled', true);
    $('#reset').prop('disabled', true);
}

//reseting the form values
function resetForm() {
    disableGrp1(true);
    disableGrp2(false);

    var getCurRequest = createGET_BY_RECORDRequest(connToken, empDBName, empRelationName, getCurrRecNoFromLS());
//                alert(putReqStr);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getCurRequest, jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({async: true});

    if (isOnlyOneRecordPresent() || isNoRecordPresentLS())
        disableGrp1(true);
    $("#new").prop('disabled', false);
    if (isNoRecordPresentLS()) {
        makeDataFormEmpty();
        $("#edit").prop('disabled', true);
    } else {
        $("#edit").prop('disabled', false);
    }
    disableForm(true);
}

//on click function
function saveEmp() {
    var jsonStr = validateData();
    if (jsonStr === "") {
        return "";
    }
    var putReqStr = createPUTRequest(connToken, jsonStr, empDBName, empRelationName);
//                alert(putReqStr);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseUrl, jpdbIML);
    alert("1 Record Added");
    jQuery.ajaxSetup({async: true});
    if (isNoRecordPresentLS())
        setFirstRecNo2LS(resultObj);
    setLastRecNo2LS(resultObj);
    setCurrRecNo2LS(resultObj);
    resetForm();
}

function editEmp() {
    disableForm(false);
    $('#empId').prop('disabled', true);
    $('#empName').focus();
    disableGrp1(true);
    disableGrp2(true);
    $('#change').prop('disabled', false);
    $('#reset').prop('disabled', false);
}

function changeEmp() {

    var jsonchag = validateData();
    var updateReq = createUPDATERecordRequest(connToken, jsonchag, empDBName, empRelationName, getCurrRecNoFromLS());

    jQuery.ajaxSetup({async: false});
    var resultJsonObj = executeCommandAtGivenBaseUrl(updateReq, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#empId").focus();
    $("#edit").focus();
}

function getEmpIdAsJsonObj() {
    var empid = $('#empId').val();
    var jsonStr = {
        id: empid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#empName').val(record.name);
    $('#empSalary').val(record.salary);
    $('#empHRA').val(record.hra);
    $('#empDA').val(record.da);
    $('#empDeduction').val(record.deduction);

}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function showData(jsonObj) {
    if (jsonObj.status === 400) {
        return;
    }
    var record = (JSON.parse(jsonObj.data)).record;
    setCurrRecNo2LS(jsonObj);
    $('#empId').val(record.id);
    $('#empName').val(record.name);
    $('#empSalary').val(record.salary);
    $('#empHRA').val(record.hra);
    $('#empDA').val(record.da);
    $('#empDeduction').val(record.deduction);
    disableGrp1(false);
    disableForm(true);
    $("#save").prop('disabled', true);
    $("#change").prop('disabled', true);
    $("#reset").prop('disabled', true);

    $("#new").prop('disabled', false);
    $("#edit").prop('disabled', false);

    if (getCurrRecNoFromLS() === getLastRecNoFromLS()) {
        $("#next").prop('disabled', true);
        $("#last").prop('disabled', true);
    }

    if (getCurrRecNoFromLS() === getFirstRecNoFromLS()) {
        $("#prev").prop('disabled', true);
        $("#first").prop('disabled', true);
        return;
    }
}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#empSave").prop('disabled', false);
        $("#empReset").prop('disabled', false);
        $("#empName").focus();
    } else if (resJsonObj.status === 200)
    {
        $("#empId").prop('disabled', true);
        fillData(resJsonObj);

        $("#empChange").prop('disabled', false);
        $("#empReset").prop('disabled', false);
        $("#empName").focus();

    }
}

function isNoRecordPresentLS() {
    if (getFirstRecNoFromLS() === "0" && getLastRecNoFromLS() === "0") {
        return true;
    }
    return false;
}

function isOnlyOneRecordPresent() {
    if (isNoRecordPresentLS()) {
        return false;
    }

    if (getFirstRecNoFromLS() === getLastRecNoFromLS()) {
        return true;
    }
    return false;
}
function checkForNoOrOneRecord() {
    if (isNoRecordPresentLS())
    {
        disableForm(true);
        disableGrp2(true);
        disableGrp1(true);
        $("#new").prop(":disabled", false);
        return;
    }
    if (isOnlyOneRecordPresent())
    {
        disableForm(true);
        disableGrp2(true);
        disableGrp1(true);
        $("#new").prop(":disabled", false);
        $("#edit").prop(":disabled", false);
        return;
    }
}

initEmpForm();
getLast();
getFirst();
checkForNoOrOneRecord();