/**
 * @param {import(".").Data} d
 */
module.exports = async(d) => {
    const data = d.util.aoiFunc(d);
    const [...channels] = data.inside.splits;

    return {
        code: d.util.setCode(data),
        data: { 
            automodRule: { 
                ...d.data.automodRule,
                exemptChannels: [...channels],
            },
        },
    };
}