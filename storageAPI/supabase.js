const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_ANON_KEY);

const createBucket = async(name) => {
    const { data, error } = await supabase.storage.createBucket(name, {
        public: false
    });
    if (error) {
        return error
    }
    return data
}

const uploadFile = async(bucket, path, file, type) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { contentType: type });
    if (error) {
        return error;
    }
    return data;
}

const downloadFile = async(bucket, path) => {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) {
        return error;
    }
    return data;
}

const deleteFile = async(bucket, path) => {
    const { data, error } = await supabase.storage.from(bucket).remove([path])
}

module.exports = {
    createBucket,
    uploadFile,
    downloadFile,
    deleteFile
}

