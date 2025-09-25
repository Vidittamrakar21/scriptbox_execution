import fs from 'fs/promises';
import path from 'path';
import fs2 from 'fs-extra';
const userDir = path.join(new URL('.', import.meta.url).pathname, '../user');





async function generateFileTree(directory) {
    const tree = {}

    async function buildTree(currentDir, currentTree) {
        

        
        const files = await fs.readdir(currentDir)

        for (const file of files) {
            if (file === 'node_modules' || file === '.next' || file === '.git' ) {
                continue; 
            }

            const filePath = path.join(currentDir, file)
            const stat = await fs.stat(filePath)

            if (stat.isDirectory()) {
                currentTree[file] = {}
                await buildTree(filePath, currentTree[file])
            } else {
                currentTree[file] = null
            }
        }

     
    }

    await buildTree(directory, tree);
    return tree
}

export const firstapi = (req,res)=>{

    try {


        res.json({message: "this is  first api"})
        
    } catch (error) {
        res.json(error)
    }
}


export const files = async (req,res)=>{

    try {

       const filetree = await generateFileTree('./user');

       res.json({ tree: filetree })
        
    } catch (error) {
        res.json(error)
    }
}

export const filecontent = async (req,res)=>{

    try {
        const path = req.query.path;
        const content = await fs.readFile(`./user${path}`, 'utf-8')
        res.json({ content })
        
    } catch (error) {
        res.json(error)
    }
}

export const clearplayground = async (req,res)=>{

    try {
        const templateDir = path.join(new URL('.', import.meta.url).pathname, `../template`);

        await fs2.emptyDir(userDir)
        await fs2.emptyDir(templateDir)
    
        
        res.json({ message:"cleared" })
        
    } catch (error) {
        res.json(error)
    }
}
export const startplayground = async (req,res)=>{

    try {
        const {temp} = req.body;
        const templateDir = path.join(new URL('.', import.meta.url).pathname, `../template/${temp}`);
      
        await fs2.emptyDir(userDir)
        
        fs2.copySync(templateDir, userDir);


        
        res.json({ message:"started" })
        
    } catch (error) {
        res.json(error)
    }
}

export const stopplayground = async (req,res)=>{

    try {

        const templateDir = path.join(new URL('.', import.meta.url).pathname, `../template`);
       await fs2.emptyDir(userDir)
       await fs2.emptyDir(templateDir)

        
        res.json({ message:"stopped" })
        
    } catch (error) {
        res.json(error)
    }
}








