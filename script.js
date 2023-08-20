const File=required('./models/file');
function fetchdata(){
    const files=File.find({createdAt: {$lt:somedate}})
}