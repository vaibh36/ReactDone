export default function matchcssfunctionclass(dlsClassName) {
    let dlsStyles = {};

    if (dlsClassName) {
        console.log('Dlsclasses are:-', dlsClassName)
       dlsClassName.split(',').forEach((element) => {
        dlsStyles= Object.assign({element})
       });

    }
    console.log('Final css classes are:-',dlsStyles)
    return dlsStyles;

}