import { CV, AtsCheckResult, AtsRecommendation } from '../types';

const STANDARD_FONTS = ['arial', 'verdana', 'times new roman', 'georgia', 'garamond'];

export const checkCvForAts = (cv: CV): AtsCheckResult => {
    const recommendations: AtsRecommendation[] = [];
    let score = 100;

    // 1. Template & Layout Check (High Severity)
    if (cv.templateId === 'creative') {
        recommendations.push({
            id: 'layout-columns',
            severity: 'high',
            title: 'Mise en page multi-colonnes',
            description: 'Les mises en page à plusieurs colonnes peuvent perturber les ATS. Préférez un modèle à une seule colonne comme "Moderne" ou "ATS Optimisé" pour une meilleure compatibilité.',
        });
        score -= 25;
    } else {
        recommendations.push({
            id: 'layout-columns-ok',
            severity: 'good',
            title: 'Mise en page sur une colonne',
            description: 'Votre CV utilise une mise en page à colonne unique, ce qui est idéal pour la compatibilité avec les ATS.',
        });
    }

    // 2. Font Check (Medium Severity)
    const headingFont = cv.layout.fonts.heading.split(',')[0].toLowerCase();
    const bodyFont = cv.layout.fonts.body.split(',')[0].toLowerCase();
    if (!STANDARD_FONTS.includes(headingFont) || !STANDARD_FONTS.includes(bodyFont)) {
        recommendations.push({
            id: 'font-choice',
            severity: 'medium',
            title: 'Polices non standards',
            description: `Utilisez des polices standards comme Arial, Times New Roman, ou Georgia. Votre CV utilise "${cv.layout.fonts.heading}" et "${cv.layout.fonts.body}", qui pourraient ne pas être reconnues.`,
        });
        score -= 10;
    } else {
         recommendations.push({
            id: 'font-choice-ok',
            severity: 'good',
            title: 'Polices standards',
            description: 'Vous utilisez des polices standards, bien lisibles par les ATS.',
        });
    }

    // 3. Section Headings Check (Medium Severity)
    const sectionTitles = cv.sections.map(s => s.title.toLowerCase());
    const standardTitles = ['résumé', 'expérience', 'formation', 'compétences', 'langues'];
    const hasStandardTitles = standardTitles.every(t => sectionTitles.some(st => st.includes(t)));
    if (!hasStandardTitles) {
        recommendations.push({
            id: 'section-headings',
            severity: 'medium',
            title: 'En-têtes de section non standards',
            description: 'Utilisez des en-têtes de section clairs et standards (ex: "Expérience Professionnelle", "Formation"). Les titres trop créatifs peuvent être mal interprétés.',
        });
        score -= 15;
    }

    // 4. Contact Info Check (High Severity)
    if (!cv.content.email || !cv.content.phone) {
         recommendations.push({
            id: 'contact-info',
            severity: 'high',
            title: 'Informations de contact manquantes',
            description: 'Votre email ou numéro de téléphone semble manquant ou n\'est pas dans un format standard. Assurez-vous qu\'ils sont clairement indiqués.',
        });
        score -= 20;
    } else {
        recommendations.push({
            id: 'contact-info-ok',
            severity: 'good',
            title: 'Informations de contact claires',
            description: 'Vos informations de contact sont présentes et devraient être faciles à analyser.',
        });
    }

    // 5. Keyword matching (Low Severity - more for ranking than parsing)
    if (cv.targetJob && cv.score) {
        if (cv.score < 70) {
            recommendations.push({
                id: 'keyword-match',
                severity: 'low',
                title: 'Optimisation des mots-clés',
                description: `Votre score de compatibilité avec l'offre est de ${cv.score}%. Pensez à intégrer plus de mots-clés de l'offre d'emploi dans votre CV.`,
            });
            score -= 5;
        }
    }

    // 6. Action Verbs Check (Low Severity)
    const actionVerbs = ['développé', 'géré', 'optimisé', 'créé', 'mis en place', 'dirigé', 'augmenté', 'réduit'];
    const hasActionVerbs = cv.content.experience.some(exp => 
        actionVerbs.some(verb => exp.description.toLowerCase().startsWith(verb))
    );
    if (!hasActionVerbs) {
        recommendations.push({
            id: 'action-verbs',
            severity: 'low',
            title: 'Utilisation de verbes d\'action',
            description: 'Commencez les descriptions de vos expériences par des verbes d\'action forts (ex: "Développé", "Géré", "Optimisé") pour plus d\'impact.',
        });
        score -= 5;
    }

    // 7. Quantifiable Achievements (Medium Severity)
    const hasNumbers = cv.content.experience.some(exp => /\d/.test(exp.description) || exp.achievements.some(ach => /\d/.test(ach)));
    if (!hasNumbers) {
        recommendations.push({
            id: 'quantify-achievements',
            severity: 'medium',
            title: 'Manque de résultats chiffrés',
            description: 'Vos réalisations ne sont pas quantifiées. Ajoutez des chiffres, pourcentages ou métriques pour démontrer concrètement votre impact (ex: "Augmentation des ventes de 20%").',
        });
        score -= 10;
    } else {
        recommendations.push({
            id: 'quantify-achievements-ok',
            severity: 'good',
            title: 'Résultats chiffrés',
            description: 'Excellent ! Vous avez inclus des résultats chiffrés, ce qui est très apprécié par les recruteurs et les ATS.',
        });
    }


    return { score: Math.max(0, score), recommendations };
};
