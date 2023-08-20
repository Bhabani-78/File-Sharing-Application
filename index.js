const dropzone=document.querySelector(".drop-zone");
const fileinput=document.querySelector("#fileinput");
const browseBtn=document.querySelector(".browseBtn");

const progressContainer=document.querySelector(".progress-container");
const bgProgress=document.querySelector(".bg-progress");
const progressBar=document.querySelector(".progress-bar");
const percentDiv=document.querySelector("#percent");

const sharingContainer=document.querySelector(".sharing-container");
const fileURLInput=document.querySelector("#fileURL");
const copyBtn=document.querySelector("#copyBtn");

const toast=document.querySelector(".toast");
const host="";
const uploadURL=`${host}api/files`;
const emailURL=`${host}api/files/send`;

dropzone.addEventListener("dragover",(e)=>{
    e.preventDefault();   
    if(!dropzone.classList.contains("dragged")){
        dropzone.classList.add("dragged");
    }
});
dropzone.addEventListener("dragleave",()=>{
    dropzone.classList.remove("dragged");
});
dropzone.addEventListener("drop",(e)=>{
    e.preventDefault();
    dropzone.classList.remove("dragged");
    const files=e.dataTransfer.files;
    console.table(files);
    if(files.length){
        filesinput.files=files;
        uploadfile();
    }
});

browseBtn.addEventListener("click",()=>{
    fileinput.click();
});


fileinput.addEventListener("change",()=>{
    uploadfile();
});

copyBtn.addEventListener("click",()=>{
    fileURLInput.select()
    document.execCommand("copy");
    showToast("Link Copied")
});
const uploadfile=()=>{
    progressContainer.style.display="block";
    const file=fileinput.files[0];
    const formData=new FormData();
    FormData.append("myfile",file);

    const xhr=new XMLHttpRequest();
    xhr.onreadystatechange=()=>{
        if(xhr.readyState==XMLHttpRequest.DONE){
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }    
    };

    xhr.upload.onprogress=updateProgress;

    xhr.upload.onerror=()=>{
        fileInput.value="";
        showToast(`Error in upload: ${xhr.statusText}`);

    }
    xhr.open("POST",uploadURL);
    xhr.send(formData);
};

const updateProgress=(e)=>{
    const percent=Math.round((e.loaded/e.total) * 100);
    // console.log(percent);
    bgProgress.style.width=`${percent}%`;
    percentDiv.innerText=percent;
    progressBar.style.transform=`scaleX(${percent/100})`;

};

const showLink=({file:url})=>{
    console.log(url);
    fileinput.value="";
    emailForm[2].removeAttribute("disabled");
    progressContainer.style.display="none";
    sharingContainer.style.display="block";
    fileURLInput.value=url;
};
emailForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    console.log("Submit form");
    const url=fileURLInput.value;
    const formData={
        uuid:url.split("/").splice(-1,1)[0],
        emailTo:emailForm.elements["to-email"].value,
        emailFrom:emailForm.elements["from-email"].value,
    };

    emailForm[2].setAttribute("disabled","true");
    console.table(formData);

    fetch(emailURL,{
        method:"POST",
        headers:{
            "content-Type":"application/json",
        },
        body:JSON.stringify(formData),
    })
    .then((res)=>res.json())
    .then(({success})=>{
        if(success){
            sharingContainer.style.display="none";
            showToast("Email Sent")
        }          
    });
});
let toastTimer;
const showToast=(msg)=>{
    toast.innerText=msg;
    toast.style.transform="translate(-50%,60px)";
    clearTimeout(toastTimer)
    toastTimer=setTimeout(()=>{
        toast.style.transform="translate(-50%,0)";
    },2000);

};