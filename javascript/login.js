function validate(){
    let user_id=document.getElementById('user_id').value;
    let password=document.getElementById('password').value;

if(user_id=="220031020064" && password=="Dev@Gupta")
{
    window.location.assign('file:///C:/Users/DEV%20GUPTA/OneDrive/Desktop/College%20Website/Dev.html');
}
else if(user_id=="220031020045" && password=="Amit@Rathore"){
    window.location.assign('file:///C:/Users/gupta/Desktop/College%20Website/Amit.html');
}
else if(user_id=="220031020112" && password=="Rahul@Gangwar"){
    window.location.assign('file:///C:/Users/DEV%20GUPTA/OneDrive/Desktop/College%20Website/Rahul.html');
}
else if(user_id=="220031020129" && password=="Sandeep@Gupta"){
        window.location.assign('file:///C:/Users/DEV%20GUPTA/OneDrive/Desktop/College%20Website/Sandeep.html');
}
else{
    alert("Wrong Credentials !!");
    return false;
}
}