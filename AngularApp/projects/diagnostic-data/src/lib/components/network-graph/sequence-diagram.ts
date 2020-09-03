import * as joint from 'jointjs';



declare module 'jointjs' {
    namespace shapes {
        namespace sd {
            class RoleGroup extends joint.shapes.standard.Rectangle {
                fitRoles(): void;
            }

            class Role extends joint.shapes.standard.Rectangle {
                setName(name:string): void;
            }

            class Lifeline extends joint.shapes.standard.Link {
                attachToRole(role:any, maxY:number):void;
            }

            class LifeSpan extends joint.dia.Link {
                attachToMessages(from:any, to:any):void;
            }

            class Message extends joint.shapes.standard.Link {
                setStart(y:number):void;
                setFromTo(from:any, to:any):void;
                setDescription(description:string):void;
                setColor(color:string):void;
            }
        }
    }
}

const RoleGroup = joint.shapes.standard.Rectangle.define('sd.RoleGroup', {
    z: 1,
    attrs: {
        body: {
            stroke: '#DDDDDD',
            strokeWidth: 1,
            fill: '#F9FBFA'
        }
    }
}, {
    fitRoles: function() {
        this.fitEmbeds({ padding: 10 });
    }
});

const Role = joint.shapes.standard.Rectangle.define('sd.Role', {
    z: 2,
    size: { width: 100, height: 80 },
    attrs: {
        body: {
            stroke: '#A0A0A0',
            strokeWidth: 1,
            rx: 2,
            ry: 2
        },
        label: {
            fontSize: 18,
            fontFamily: 'sans-serif',
            textWrap: {
                width: -10
            }
        }
    }
}, {
    setName: function(name) {
        this.attr(['label', 'text'], name);
    }
});

const Lifeline = joint.shapes.standard.Link.define('sd.Lifeline', {
    z: 3,
    attrs: {
        line: {
            stroke: '#A0A0A0',
            strokeWidth: 1,
            strokeDasharray: '5,2',
            targetMarker: null
        }
    }
}, {
    attachToRole: function(role, maxY) {
        const roleCenter = role.getBBox().center();
        this.set({
            source: { id: role.id },
            target: { x: roleCenter.x, y: maxY }
        });
        role.embed(this);
    }
});

const LifeSpan = joint.dia.Link.define('sd.LifeSpan', {
    z: 4,
    attrs: {
        line: {
            connection: true,
            stroke: '#222222',
            strokeWidth: 2
        },
        icon: {
            atConnectionRatioIgnoreGradient: 0.5
        }
    }
}, {
    markup: [{
        tagName: 'path',
        selector: 'line',
        attributes: {
            'fill': 'none',
            'pointer-events': 'none'
        }
    }, {
        tagName: 'g',
        selector: 'icon',
        children: [{
            tagName: 'circle',
            attributes: {
                'r': 12,
                'fill': '#222222'
            }
        }, {
            tagName: 'path',
            attributes: {
                'd': 'M -3 -5 3 -5 3 -2 -3  2 -3 5 3 5 3 2 -3 -2 Z',
                'stroke': '#FFFFFF',
                'stroke-width': 1,
                'fill': 'none'
            }
        }]
    }],
    attachToMessages: function(from, to) {
        this.source(from, { anchor: { name: 'connectionRatio', args: { ratio: 1 }}});
        this.target(to, { anchor: { name: 'connectionRatio', args: { ratio: 0 }}});
    }
});

const Message = joint.shapes.standard.Link.define('sd.Message', {
    z: 5,
    source: { anchor: { name: 'connectionLength' }},
    target: { anchor: { name: 'connectionPerpendicular' }},
    attrs: {
        line: {
            stroke: '#4666E5',
            sourceMarker: {
                'type': 'path',
                'd': 'M -3 -3 -3 3 3 3 3 -3 z',
                'stroke-width': 3
            }
        },
        wrapper: {
            strokeWidth: 20,
            cursor: 'grab'
        },
    },
    color: "#4666E5"
}, {
    defaultLabel: {
        markup: [{
            tagName: 'rect',
            selector: 'labelBody'
        }, {
            tagName: 'text',
            selector: 'labelText'
        }],
        attrs: {
            labelBody: {
                ref: 'labelText',
                refWidth: '100%',
                refHeight: '100%',
                refWidth2: 20,
                refHeight2: 10,
                refX: -10,
                refY: -5,
                rx: 2,
                ry: 2,
                fill: '#4666E5'
            },
            labelText: {
                fill: '#FFFFFF',
                fontSize: 12,
                fontFamily: 'sans-serif',
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
                cursor: 'grab'
            }
        }
    },
    setStart: function(y) {
        this.prop(['source', 'anchor', 'args', 'length'], y);
    },
    setFromTo: function(from, to) {
        this.prop({
            source: { id: from.id },
            target: { id: to.id }
        });
    },
    setDescription: function(description) {
        this.labels([{ attrs: { labelBody: {fill: this.attributes.color}, labelText: { text: description }}}]);
    },
    setColor: function(color: string){
        this.prop({attrs:{line:{stroke: color}}, color: color});
        for(let i in this.attributes.labels){
            this.attributes.labels[i].attrs.labelBody = {fill: color};
        }
    }
});

(<any>Object).assign(joint.shapes, {
    sd: {
        RoleGroup,
        Role,
        Lifeline,
        LifeSpan,
        Message
    }
});